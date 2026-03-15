import { subscribe } from "../actions/subscribe";
import { PolkabillConfig, SubscribeParams } from "../types";

export class PolkabillClient {
    config: PolkabillConfig

    constructor(config: PolkabillConfig) {
        this.config = config;
    }

    async subscribe(params: SubscribeParams) {
        return subscribe(this.config, params);
    }
}