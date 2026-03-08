import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {User} from "./user.model"
import {Merchant} from "./merchant.model"
import {Plan} from "./plan.model"
import {SubscriptionStatus} from "./_subscriptionStatus"
import {Charge} from "./charge.model"

@Entity_()
export class Subscription {
    constructor(props?: Partial<Subscription>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => User, {nullable: true})
    user!: User

    @Index_()
    @ManyToOne_(() => Merchant, {nullable: true})
    merchant!: Merchant

    @Index_()
    @ManyToOne_(() => Plan, {nullable: true})
    plan!: Plan

    @Index_()
    @ManyToOne_(() => Plan, {nullable: true})
    pendingPlan!: Plan | undefined | null

    @Column_("varchar", {length: 9, nullable: false})
    status!: SubscriptionStatus

    @BigIntColumn_({nullable: false})
    startTime!: bigint

    @BigIntColumn_({nullable: false})
    nextBillingTime!: bigint

    @BigIntColumn_({nullable: false})
    billingCycle!: bigint

    @BigIntColumn_({nullable: true})
    cancelledAt!: bigint | undefined | null

    @OneToMany_(() => Charge, e => e.subscription)
    charges!: Charge[]

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date
}
