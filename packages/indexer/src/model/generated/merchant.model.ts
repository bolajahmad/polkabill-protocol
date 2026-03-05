import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, StringColumn as StringColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Payout} from "./payout.model"
import {Status} from "./_status"
import {Plan} from "./plan.model"
import {Subscription} from "./subscription.model"

@Entity_()
export class Merchant {
    constructor(props?: Partial<Merchant>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => Payout, e => e.merchant)
    payout!: Payout[]

    @StringColumn_({nullable: true})
    metadataUri!: string | undefined | null

    @Column_("varchar", {length: 8, nullable: false})
    status!: Status

    @IntColumn_({nullable: false})
    billingWindow!: number

    @IntColumn_({nullable: false})
    grace!: number

    @OneToMany_(() => Plan, e => e.merchant)
    plans!: Plan[]

    @OneToMany_(() => Subscription, e => e.merchant)
    subscriptions!: Subscription[]

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date
}
