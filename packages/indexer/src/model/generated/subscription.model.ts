import { BigIntColumn as BigIntColumn_, Column as Column_, DateTimeColumn as DateTimeColumn_, Entity as Entity_, Index as Index_, JoinColumn as JoinColumn_, ManyToOne as ManyToOne_, OneToMany as OneToMany_, PrimaryColumn as PrimaryColumn_ } from "@subsquid/typeorm-store"
import { SubscriptionStatus } from "./_subscriptionStatus"
import { Charge } from "./charge.model"
import { Merchant } from "./merchant.model"
import { Plan } from "./plan.model"
import { User } from "./user.model"

@Entity_()
export class Subscription {
    constructor(props?: Partial<Subscription>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => User, {nullable: true})
    @JoinColumn_({ name: "user_id" })
    user!: User

    @Index_()
    @ManyToOne_(() => Merchant, {nullable: true})
    @JoinColumn_({ name: "merchant_id" })
    merchant!: Merchant

    @Index_()
    @ManyToOne_(() => Plan, {nullable: true})
    @JoinColumn_({ name: "plan_id" })
    plan!: Plan

    @Index_()
    @ManyToOne_(() => Plan, { nullable: true})
    @JoinColumn_({ name: "pending_plan_id" })
    pendingPlan!: Plan | undefined | null

    @Column_("varchar", {length: 9, nullable: false})
    status!: SubscriptionStatus

    @BigIntColumn_({ name: "start_time", nullable: false})
    startTime!: bigint

    @BigIntColumn_({ name: "next_billing_time", nullable: false})
    nextBillingTime!: bigint

    @BigIntColumn_({ name: "billing_cycle", nullable: false})
    billingCycle!: bigint

    @BigIntColumn_({ name: "cancelled_at", nullable: true})
    cancelledAt!: bigint | undefined | null

    @OneToMany_(() => Charge, e => e.subscription)
    charges!: Charge[]

    @DateTimeColumn_({ name: "created_at", nullable: false })
    createdAt!: Date

    @DateTimeColumn_({ name: "updated_at", nullable: false })
    updatedAt!: Date
}
