import { Column as Column_, DateTimeColumn as DateTimeColumn_, Entity as Entity_, IntColumn as IntColumn_, OneToMany as OneToMany_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_ } from "@subsquid/typeorm-store"
import { Status } from "./_status"
import { Payout } from "./payout.model"
import { Plan } from "./plan.model"
import { Subscription } from "./subscription.model"

@Entity_()
export class Merchant {
    constructor(props?: Partial<Merchant>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => Payout, e => e.merchant)
    payout!: Payout[]

    @StringColumn_({ name: "metadata_uri", nullable: false})
    metadataUri!: string

    @Column_("varchar", {length: 8, nullable: false})
    status!: Status

    @IntColumn_({ name: "billing_window", nullable: false})
    billingWindow!: number

    @IntColumn_({nullable: false})
    grace!: number

    @OneToMany_(() => Plan, e => e.merchant)
    plans!: Plan[]

    @OneToMany_(() => Subscription, e => e.merchant)
    subscriptions!: Subscription[]

    @DateTimeColumn_({ name: "created_at", nullable: false })
    createdAt!: Date

    @DateTimeColumn_({ name: "updated_at", nullable: false })
    updatedAt!: Date
}
