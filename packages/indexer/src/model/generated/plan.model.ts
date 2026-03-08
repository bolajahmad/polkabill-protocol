import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Merchant} from "./merchant.model"
import {Status} from "./_status"
import {Subscription} from "./subscription.model"

@Entity_()
export class Plan {
    constructor(props?: Partial<Plan>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Merchant, {nullable: true})
    merchant!: Merchant

    @BigIntColumn_({nullable: false})
    price!: bigint

    @IntColumn_({nullable: false})
    billingInterval!: number

    @IntColumn_({nullable: false})
    grace!: number

    @Column_("varchar", {length: 8, nullable: false})
    status!: Status

    @StringColumn_({nullable: false})
    metadataUri!: string

    @OneToMany_(() => Subscription, e => e.plan)
    subscriptions!: Subscription[]

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date
}
