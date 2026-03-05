import { viem, network } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { ChainRegistryContractAddress } from "../../utils/constants";
import { expect } from "chai";
import { encodeAbiParameters, keccak256, parseAbiParameters, toHex } from "viem";

describe("Polkabill - Full E2E", function () {
  async function deployFixture() {
    const [owner, merchant, subscriber, other, user] =
      await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    // Deploy ChainRegistry
    const chainRegistry = await viem.deployContract("ChainRegistry", [
      "0xa60455db7f535af309dd654bcb38cc95c2dd32e8f9c3f859590988115f391d30",
      other.account.address,
    ]);

    // Deploy Merchantregistry
    const merchantRegistry = await viem.deployContract("MerchantRegistry", [
      chainRegistry.address,
      owner.account.address,
      owner.account.address,
    ]);

    // Deploy PlanRegistry
    const planRegistry = await viem.deployContract("PlanRegistry", [
      merchantRegistry.address,
    ]);

    // Deploy SubscriptionManager
    const subManager = await viem.deployContract("SubscriptionManager", [
      merchantRegistry.address,
      planRegistry.address,
      owner.account.address,
      chainRegistry.address,
    ]);

    const token = await viem.deployContract("DummyERC20", ["NAME", "NME", 18]);

    // // Deploy SubscriptionsController
    const controller = await viem.deployContract("SubscriptionsController", [
      "0xbb26e04a71e7c12093e82b83ba310163eac186fa", // host mock
      token.address, // fee token dummy
      chainRegistry.address,
      subManager.address,
      merchantRegistry.address,
    ]);

    const adapter = await viem.deployContract("BillingAdapter");
    adapter.write.initialize([
        "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a",
        controller.address,
        token.address
    ]);

    console.log({ adapter: keccak256(await publicClient.getCode(adapter) as `0x${string}`) });
    return {
      owner,
      merchant,
      subscriber,
      publicClient,
      chainRegistry,
      merchantRegistry,
      planRegistry,
      subManager,
      controller,
      token,
      user,
      other,
      adapter
    };
  }

  /* ---------------------------------------------------------- */
  /* ------------------ MERCHANT + PLAN ------------------------ */
  /* ---------------------------------------------------------- */
  describe("Merchant & Plan Setup", function () {
    it("Should create merchant and plan successfully", async function () {
      const { merchant, merchantRegistry, planRegistry, owner } =
        await deployFixture();

      // Create merchant
      const grace = 86400n; // 1 day
      await merchantRegistry.write.createMerchant(
        [merchant.account.address, grace, 3600n, "0x"],
        { account: merchant.account },
      );
      const m = await merchantRegistry.read.getMerchant([
        merchant.account.address,
      ]);
      expect(m.active).to.equal(true);

      // Create plan and test
      await planRegistry.write.createPlan(
        [
          100n, // Price: 100 tokens
          7n * 24n * 3600n, // Billing cycle: 7 days
          0n, // Grace period
          "0x", // Metadata
        ],
        { account: merchant.account },
      );
      const p = await planRegistry.read.getPlan([1n]);
      expect(p.price).to.equal(100n);
      expect(p.merchantId.toLowerCase()).to.equal(
        merchant.account.address.toLowerCase(),
      );

      // Create plan with unregistered merchant should never succeed
      await expect(
        planRegistry.write.createPlan(
          [
            100n, // Price: 100 tokens
            7n * 24n * 3600n, // Billing cycle: 7 days
            0n, // Grace period
            "0x", // Metadata
          ],
          { account: owner.account },
        ),
      ).to.be.rejected;
    });
  });

  /* ---------------------------------------------------------- */
  /* ------------------ SUBSCRIPTION FLOW ---------------------- */
  /* ---------------------------------------------------------- */
  describe("Subscription Flow", function () {
    it("full billing lifecycle works", async function () {
      const {
        owner,
        merchant,
        subscriber,
        merchantRegistry,
        planRegistry,
        subManager,
        chainRegistry,
        controller,
        token,
        adapter
      } = await deployFixture();

      // Create merchant
      await merchantRegistry.write.createMerchant(
        [merchant.account.address, 86400n, 3600n, "0x"],
        { account: merchant.account },
      );

      // Create plan
      const interval = 30n * 24n * 60n * 60n;
      await planRegistry.write.createPlan(
        [
          100n, // Price: 100 tokens
          interval, // Interval: 30 days
          0n, // Grace period
          "0x", // Metadata
        ],
        { account: merchant.account },
      );

      // User subscribes to plan
      const txHash = await subManager.write.subscribe([1n], {
        account: subscriber.account,
      });
      const subId = 1n;

      let sub = await subManager.read.getSubscription([subId]);
      expect(sub.billingCycle).to.equal(1n);
      expect(sub.subscriber.toLowerCase()).to.equal(
        subscriber.account.address.toLowerCase(),
      );
      expect(sub.status).to.equal(1); // Active

      // Move time to billing window
      const { window } = await merchantRegistry.read.getMerchant([
        merchant.account.address,
      ]);
      await time.increase(Number(interval - window)); // Increase time by `interval`

      // Check charge is allowed
      const isAllowed = await subManager.read.isChargeAllowed([subId]);
      expect(isAllowed).to.equal(true);

      // Simulate BillingAdapter -> Controller confirmations
      const body = encodeAbiParameters(
        parseAbiParameters("uint256, uint256, uint256"),
        [subId, 1n, 100n],
      );
      const wrapped = encodeAbiParameters(parseAbiParameters("uint8, bytes"), [
        1,
        body,
      ]);

      // Register a new chain, or errors
      let chainId = 84532n;
      await chainRegistry.write.registerChain([chainId, adapter.address]);
      await chainRegistry.write.setChainStatus([chainId, true]);
      await chainRegistry.write.setTokenSupport([chainId, token.address, true]);

      await subManager.write.requestCharge([subId, chainId, token.address]);
    });
  });
  //   describe("Charging Flow");
  //   describe("Cross-Chain Dispatch");
  //   describe("Failure & Retry Scenarios");
  //   describe("Multi-Cycle Simulation");
  //   describe("State Invariants");
});
