import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseUnits } from "viem";

async function deployFixture() {
  const [owner, controller, user, other, admin] =
    await hre.viem.getWalletClients();

  // Deploy mock registeries
  const merchantRegistry = await hre.viem.deployContract(
    "MockMerchantRegistry",
    [],
  );
  const planRegistry = await hre.viem.deployContract("MockPlanRegistry", []);

  // Deploy subscriptions manager
  const subManager = await hre.viem.deployContract("SubscriptionManager", [
    merchantRegistry.address,
    planRegistry.address,
    controller.account.address,
    "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a", // ChainRegistry address, not used in this test but required for constructor
  ]);

  const publicClient = await hre.viem.getPublicClient();

  return {
    owner,
    controller,
    user,
    other,
    admin,
    merchantRegistry,
    planRegistry,
    subManager,
    publicClient,
  };
}

async function setupActivePlan() {
  const fixture = await loadFixture(deployFixture);
  const { merchantRegistry, planRegistry, admin } = fixture;

  await merchantRegistry.write.createMerchant(
    [
      admin.account.address,
      5n * 60n * 60n, // Grace: 5 hours
      24n * 60n * 60n, // Window: 24 hours
      "0x", // Metadata
    ],
    { account: admin.account },
  );
  await planRegistry.write.createPlan(
    [
      parseUnits("10", 18), // Price: 10 tokens
      7n * 24n * 60n * 60n, // Billing cycle: 7 days
      0n, // Grace period
      "0x", // Metadata
    ],
    { account: admin.account },
  );

  return fixture;
}

describe("SubscriptionManager", function () {
  /* ============================================================= */
  /* ======================= SUBSCRIBE ACTIONS ============================ */
  /* ============================================================= */
  describe("subscribe", function () {
    it("Should create subscription when plan * merchant are active", async function () {
      const { subManager, user } = await setupActivePlan();

      const subManagerAsUser = await hre.viem.getContractAt(
        "SubscriptionManager",
        subManager.address,
        { client: { wallet: user } },
      );
      const tx = await subManagerAsUser.write.subscribe([1n]);
      expect(tx).to.exist;
    });

    it("Should set first sub to ID 1", async function () {
      const { subManager, user } = await setupActivePlan();

      const subManagerAsUser = await hre.viem.getContractAt(
        "SubscriptionManager",
        subManager.address,
        { client: { wallet: user } },
      );
      await subManagerAsUser.write.subscribe([1n]);

      const sub = await subManager.read.getSubscription([1n]);
      expect(sub.subscriber.toLowerCase()).to.equal(user.account.address.toLowerCase());
      expect(sub.planId).to.equal(1n);
    });

    it("Should revert if plan is not active", async function () {
      const { subManager, user } = await loadFixture(deployFixture);

      await expect(subManager.write.subscribe([1n], { account: user.account }))
        .to.be.rejected;
    });

    it("Should revert if merchant is not active", async function () {
      const { merchantRegistry, planRegistry, admin, subManager, user } =
        await loadFixture(deployFixture);

      await merchantRegistry.write.createMerchant(
        [
          admin.account.address,
          0n * 60n * 60n, // Grace: 0 hours
          0n * 60n * 60n, // Window: 0 hours
          "0x", // Metadata
        ],
        { account: user.account },
      );
      await planRegistry.write.createPlan([
        parseUnits("10", 18), // Price: 10 tokens
        7n * 24n * 60n * 60n, // Billing cycle: 7 days
        0n, // Grace period
        "0x", // Metadata
      ]);

      await expect(
        subManager.write.subscribe([1n], {
          account: user.account,
        }),
      ).to.be.rejected;
    });
  });
});
