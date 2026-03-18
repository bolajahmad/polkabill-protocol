import { BigIntColumn as BigIntColumn_, Column as Column_, DateTimeColumn as DateTimeColumn_, Entity as Entity_, Index as Index_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, OneToMany as OneToMany_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_ } from "@subsquid/typeorm-store"
import { Status } from "./_status"
import { Merchant } from "./merchant.model"
import { Subscription } from "./subscription.model"

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

    @IntColumn_({ name: "billing_interval", nullable: false})
    billingInterval!: number

    @IntColumn_({nullable: false})
    grace!: number

    @Column_("varchar", {length: 8, nullable: false})
    status!: Status

    @StringColumn_({ name: "metadata_uri", nullable: false})
    metadataUri!: string

    @OneToMany_(() => Subscription, e => e.plan)
    subscriptions!: Subscription[]

    @DateTimeColumn_({ name: "created_at", nullable: false })
    createdAt!: Date

    @DateTimeColumn_({ name: "updated_at", nullable: false })
    updatedAt!: Date
}
