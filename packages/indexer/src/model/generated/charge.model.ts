import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Subscription} from "./subscription.model"
import {Adapter} from "./adapter.model"

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

    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    token!: string

    @Index_()
    @StringColumn_({nullable: false})
    payoutAddress!: string

    @BigIntColumn_({nullable: false})
    billingCycle!: bigint

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @BigIntColumn_({nullable: false})
    blockNumber!: bigint

    @BooleanColumn_({nullable: false})
    success!: boolean

    @DateTimeColumn_({nullable: false})
    createdAt!: Date
}
