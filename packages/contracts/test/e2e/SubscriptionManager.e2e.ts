import { time } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

describe("Polkabill - Full E2E", function () {
  async function deployFixture() {
    const [owner, merchant, subscriber, other, user] =
      await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    // Deploy ChainRegistry (no constructor args)
    const chainRegistry = await viem.deployContract("ChainRegistry", []);

    // Deploy SubscriptionManager first (needed by MerchantRegistry)
    const subManager = await viem.deployContract("SubscriptionManager", [
      chainRegistry.address,
    ]);

    // Deploy MerchantRegistry (needs chainRegistry + subManager)
    const merchantRegistry = await viem.deployContract("MerchantRegistry", [
      chainRegistry.address,
      subManager.address,
    ]);

    // Deploy PlanRegistry
    const planRegistry = await viem.deployContract("PlanRegistry", [
      merchantRegistry.address,
    ]);

    const token = await viem.deployContract("DummyERC20", ["NAME", "NME", 18]);

    // Deploy mock host for Hyperbridge dispatch calls
    const mockHost = await viem.deployContract("MockHost");

    // Deploy SubscriptionsController
    const controller = await viem.deployContract("SubscriptionsController", [
      mockHost.address, // host mock
      token.address, // fee token dummy
      chainRegistry.address,
      subManager.address,
      merchantRegistry.address,
    ]);

    // Wire up registries and controllers
    await subManager.write.updateMerchantRegistry([merchantRegistry.address]);
    await subManager.write.updatePlanRegistry([planRegistry.address]);
    await subManager.write.updateController([controller.address]);
    await chainRegistry.write.updateController([controller.address]);
    await merchantRegistry.write.updateController([controller.address]);

    const adapter = await viem.deployContract("BillingAdapter");
    await adapter.write.initialize([
        "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a",
        controller.address,
        token.address
    ]);

    console.log({ adapter: keccak256(await publicClient.getCode({address: adapter.address}) as `0x${string}`) });
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
        [grace, 3600n, "0x"],
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
        [86400n, 3600n, "0x"],
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

      // Move time to within the billing window
      // nextChargeAt = startTime + merchant.window, window opens immediately
      const { window: billingWindow } = await merchantRegistry.read.getMerchant([
        merchant.account.address,
      ]);
      await time.increase(Number(billingWindow)); // Advance to nextChargeAt

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
