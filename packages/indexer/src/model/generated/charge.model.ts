import { BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, DateTimeColumn as DateTimeColumn_, Entity as Entity_, Index as Index_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_ } from "@subsquid/typeorm-store"
import { Adapter } from "./adapter.model"
import { Subscription } from "./subscription.model"

@Entity_()
export class Charge {
    constructor(props?: Partial<Charge>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Subscription, {nullable: true})
    subscription!: Subscription

    @Index_()
    @ManyToOne_(() => Adapter, {nullable: true})
    adapter!: Adapter

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @IntColumn_({ name: "chain_id", nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    token!: string

    @Index_()
    @StringColumn_({ name: "payout_address", nullable: false})
    payoutAddress!: string

    @BigIntColumn_({nullable: false})
    billingCycle!: bigint

    @Index_()
    @StringColumn_({ name: "tx_hash", nullable: false})
    txHash!: string

    @BigIntColumn_({ name: "block_number", nullable: false})
    blockNumber!: bigint

    @BooleanColumn_({nullable: false})
    success!: boolean

    @DateTimeColumn_({ name: "created_at", nullable: false})
    createdAt!: Date
}
