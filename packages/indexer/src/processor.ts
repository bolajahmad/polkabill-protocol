import { EvmBatchProcessor, FieldSelection } from "@subsquid/evm-processor";
import * as chainRegAbi from "./abi/chain-registry";
import * as merchantRegAbi from "./abi/merchant-registry";
import * as planRegAbi from "./abi/plan-registry";
import * as subControllerAbi from "./abi/subscriptions-controller";
import * as subManagerAbi from "./abi/subscriptions-manager";
import { Contracts, NetworkConfig } from "./utils/network-config";

const fields = {
  log: {
    transactionHash: true,
  },
} satisfies FieldSelection;
export type Fields = typeof fields;

export function makeProcessor(
  config: NetworkConfig,
): EvmBatchProcessor<Fields> {
  const headPollInterval = Number(process.env.RPC_HEAD_POLL_INTERVAL_MS ?? 15000);

  return (
    new EvmBatchProcessor()
      .setRpcEndpoint({
        url: config.rpcEndpoint,
        rateLimit: 5,
        capacity: 1,
        retryAttempts: 20,
        maxBatchCallSize: 5
      })
      .setRpcDataIngestionSettings({
        headPollInterval,
      })
      .setFinalityConfirmation(config.finalityConfirmation)
      // .setFields() is for choosing data fields for the selected data items.
      // Here we're requesting hashes of parent transaction for all event logs.
      .setFields({
        log: {
          transactionHash: true,
        },
      })
      .setBlockRange({ from: config.startAtBlock, to: undefined }) // Starting block height. Can also specify "to" and "step".
      // .addXXX() methods request data items. In this case we're asking for
      // Transfer(address,address,uint256) event logs emitted by the USDC contract.
      //
      // We could have omitted the "address" filter to get Transfer events from
      // all contracts, or the "topic0" filter to get all events from the USDC
      // contract, or both to get all event logs chainwide. We also could have
      // requested some related data, such as the parent transaction or its traces.
      //
      // Other .addXXX() methods (.addTransaction(), .addTrace(), .addStateDiff()
      // on EVM) are similarly feature-rich.
      .addLog({
        range: { from: config.startAtBlock },
        address: [config.contract[Contracts.SUB_MANAGER]],
        topic0: [
          subManagerAbi.events.Subscribed.topic,
          subManagerAbi.events.PlanChangeScheduled.topic,
          subManagerAbi.events.PlanChanged.topic,
          subManagerAbi.events.SubscriptionPaid.topic,
          subManagerAbi.events.SubscriptionUpdated.topic,
        ],
      })
      .addLog({
        range: { from: config.startAtBlock },
        address: [config.contract[Contracts.MERCHANT_REGISTRY]],
        topic0: [
          merchantRegAbi.events.MerchantCreated.topic,
          merchantRegAbi.events.MerchantStatusUpdated.topic,
          merchantRegAbi.events.MerchantUpdated.topic,
          merchantRegAbi.events.PayoutAddressSet.topic,
          merchantRegAbi.events.TokensAdded.topic,
        ],
      })
      .addLog({
        range: { from: config.startAtBlock },
        address: [config.contract[Contracts.PLAN_REGISTRY]],
        topic0: [
          planRegAbi.events.PlanCreated.topic,
          planRegAbi.events.PlanUpdated.topic,
        ],
      })
      .addLog({
        range: { from: config.startAtBlock },
        address: [config.contract[Contracts.CHAIN_REGISTRY]],
        topic0: [
          chainRegAbi.events.ChainRegistered.topic,
          chainRegAbi.events.ChainStatusUpdated.topic,
          chainRegAbi.events.TokenSupportUpdated.topic,
        ],
      })
      .addLog({
        range: { from: config.startAtBlock },
        address: [config.contract[Contracts.SUB_CONTROLLER]],
        topic0: [
          subControllerAbi.events.ChargeConfirmed.topic,
          subControllerAbi.events.ChargeRequestRelayed.topic,
          subControllerAbi.events.TokenUpdateRelayed.topic,
          subControllerAbi.events.MerchantProfileUpdated.topic,
        ],
      })
  );
}
