import { AdapterClient } from "./adapter";
import type { ILifecycle } from "./types";
import { transition, createInitialState } from "./state-machine";

export class PolkabillClient {
  constructor(
    private adapter: AdapterClient
  ) {}

  async subscribe(
    planId: bigint,
    onUpdate: (state: ILifecycle) => void
  ) {
    let state = createInitialState();

    try {
      state = transition(state, { status: "awaiting_signature" });
      onUpdate(state);

      const txHash = await this.adapter.subscribe(planId);

      state = transition(state, {
        status: "tx_submitted",
        txHash,
      });
      onUpdate(state);

      state = transition(state, { status: "crosschain_pending" });
      onUpdate(state);

      // Hackathon version: just wait for receipt
      // In production: poll hub

      state = transition(state, { status: "confirmed" });
      onUpdate(state);

    } catch (err: any) {
      state = transition(state, {
        status: "failed",
        error: err.message,
      });
      onUpdate(state);
    }
  }

  async cancel(
    subscriptionId: bigint,
    onUpdate: (state: ILifecycle) => void
  ) {
    let state = createInitialState();

    try {
      state = transition(state, { status: "awaiting_signature" });
      onUpdate(state);

      const txHash = await this.adapter.cancel(subscriptionId);

      state = transition(state, {
        status: "tx_submitted",
        txHash,
      });
      onUpdate(state);

      state = transition(state, { status: "cancelled" });
      onUpdate(state);

    } catch (err: any) {
      state = transition(state, {
        status: "failed",
        error: err.message,
      });
      onUpdate(state);
    }
  }
}