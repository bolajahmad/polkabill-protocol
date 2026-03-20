import * as merchantRegAbi from "../abi/merchant-registry";
import * as subControllerAbi from "../abi/subscriptions-controller";
import { Merchant, Payout, Status } from "../model";
import { EntityManager } from "../utils/entity-manager";
import { merchantPayoutId, relayAdminTokenUpdateId, relayMerchantUpdateId } from "../utils/helpers";

export function handleMerchantCreated(log: any, em: EntityManager) {
  const { mId, metadata } = merchantRegAbi.events.MerchantCreated.decode(log);

  // Skip if merchant already exists
  if (em.getMerchant(mId.toLowerCase())) return;

  const merchant = new Merchant({
    id: mId.toLowerCase(),
    metadataUri: metadata,
    status: Status.ACTIVE,
    billingWindow: 0,
    grace: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  em.createMerchant(merchant);
}

export function handleMerchantUpdated(log: any, em: EntityManager) {
  const { mid, window, _grace, metadata } =
    merchantRegAbi.events.MerchantUpdated.decode(log);

  const merchantId = mid.toLowerCase();
  let merchant = em.getMerchant(merchantId);

  // If merchant doesn't exist, create it (MerchantUpdated can be the first event)
  if (!merchant) {
    merchant = new Merchant({
      id: merchantId,
      metadataUri: metadata,
      billingWindow: Number(window),
      grace: Number(_grace),
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    em.createMerchant(merchant);
    return;
  }

  em.updateMerchant(merchantId, {
    metadataUri: metadata,
    billingWindow: Number(window),
    grace: Number(_grace),
    updatedAt: new Date(),
  });
}

export function handlePayoutAddressSet(log: any, em: EntityManager) {
  const { chainId, mId, payoutAddr } =
    merchantRegAbi.events.PayoutAddressSet.decode(log);

  const merchantId = mId.toLowerCase();
  const merchant = em.getMerchant(merchantId);
  if (!merchant) return;

  // Find existing payout for this merchant + chain combo
  const existingPayout = em.getPayoutByMerchantAndChain(merchantId, Number(chainId));

  if (existingPayout) {
    // Update existing payout
    em.updatePayout(existingPayout.id, {
      address: payoutAddr.toLowerCase(),
      updatedAt: new Date(),
    });
  } else {
    // Create new payout
    const payoutId = merchantPayoutId(mId, chainId);
    const payout = new Payout({
      id: payoutId,
      merchant,              // FK → Merchant
      chainId: Number(chainId),
      address: payoutAddr.toLowerCase(),
      tokens: [],            // Initialize empty
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    em.createPayout(payout);
  }
}

export function handleMerchantStatusUpdated(log: any, em: EntityManager) {
  const { mId, status } =
    merchantRegAbi.events.MerchantStatusUpdated.decode(log);

  em.updateMerchant(mId.toLowerCase(), {
    status: status ? Status.ACTIVE : Status.PAUSED,
    updatedAt: new Date(),
  });
}

export function handleTokensAdded(log: any, em: EntityManager) {
  const { mid, cid, isAdding, tokens } =
    merchantRegAbi.events.TokensAdded.decode(log);

  const merchantId = mid.toLowerCase();
  const merchant = em.getMerchant(merchantId);
  if (!merchant) return;

  // Find payout for this merchant + chain
  const payout = em.getPayoutByMerchantAndChain(merchantId, Number(cid));
  if (!payout) {
    // Create payout if it doesn't exist
    const payoutId = merchantPayoutId(mid, cid);
    const newPayout = new Payout({
      id: payoutId,
      merchant,
      chainId: Number(cid),
      address: "", // Address will be set via PayoutAddressSet event
      tokens: isAdding ? tokens : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    em.createPayout(newPayout);
    return;
  }

  const currentTokens = payout.tokens && Array.isArray(payout.tokens) ? payout.tokens : [];
  const updatedTokens = isAdding
    ? Array.from(new Set([...currentTokens, ...tokens]))
    : currentTokens.filter((t) => !tokens.includes(t));

  em.updatePayout(payout.id, {
    tokens: updatedTokens,
    updatedAt: new Date(),
  });
}

export function handleAdminRelayMerchantUpdate(log: any, em: EntityManager) {
  const { chainId, merchant: mid, payout, nonce } = subControllerAbi.events.MerchantUpdateRequested.decode(log);

  const relayId = relayMerchantUpdateId(mid as `0x${string}`, payout as `0x${string}`, nonce);
  const relay = em.getRelay(relayId);

  const merchant = em.getMerchant(mid.toLowerCase());
  const chain = em.getAdapter(chainId.toString());
  if (!merchant || !chain) return;

  if (!relay) {
    em.createRelay({
      id: relayId,
      type: "MERCHANT_PAYOUT",
      merchant,
      adapter: chain,
      nonce: nonce,
      allow: null,
      token: null
    })
    return;
  };
}

export function  handleAdminRelayTokenUpdate(log: any, em: EntityManager) {
  const { allowed, chainId, nonce, token } = subControllerAbi.events.TokenUpdateRequested.decode(log);

  const relayId = relayAdminTokenUpdateId(token as `0x${string}`, allowed, nonce);
    const relay = em.getRelay(relayId);

  const chain = em.getAdapter(chainId.toString());
  if (!chain) return;

  if (!relay) {
    em.createRelay({
      id: relayId,
      type: "TOKEN_SUPPORT",
      adapter: chain,
      nonce: nonce,
      allow: allowed,
      merchant: null,
      token: token as `0x${string}`,
    })
    return;
  };
}