import { Adapter, Status } from "../model";
import { EntityManager } from "../utils/entity-manager";
import * as chainRegAbi from "../abi/chain-registry";

export function handleChainRegistered(log: any, em: EntityManager) {
  const { billingAdapter, chainId } =
    chainRegAbi.events.ChainRegistered.decode(log);

  // Skip if adapter already exists
  if (em.getAdapter(chainId.toString())) return;

  const adapter = new Adapter({
    id: chainId.toString(),
    address: billingAdapter,
    tokens: [], // Initialize empty array
    status: Status.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  em.createAdapter(adapter);
}

export function handleChainStatusUpdated(log: any, em: EntityManager) {
  const { active, chainId } =
    chainRegAbi.events.ChainStatusUpdated.decode(log);

  const adapter = em.getAdapter(chainId.toString());
  if (!adapter) return;

  em.updateAdapter(chainId.toString(), {
    status: active ? Status.ACTIVE : Status.PAUSED,
    updatedAt: new Date(),
  });
}

export function handleUpdateSupportedChainTokens(log: any, em: EntityManager) {
  const { chainId, token, supported } =
    chainRegAbi.events.TokenSupportUpdated.decode(log);

  const adapter = em.getAdapter(chainId.toString());
  if (!adapter) return;

  const currentTokens = adapter.tokens || [];

  const updatedTokens = supported
    ? Array.from(new Set([...currentTokens, token]))
    : currentTokens.filter((t) => t !== token);

  em.updateAdapter(chainId.toString(), {
    tokens: updatedTokens,
    updatedAt: new Date(),
  });
}