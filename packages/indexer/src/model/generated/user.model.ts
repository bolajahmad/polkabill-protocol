import { DateTimeColumn as DateTimeColumn_, Entity as Entity_, OneToMany as OneToMany_, PrimaryColumn as PrimaryColumn_ } from "@subsquid/typeorm-store"
import { Subscription } from "./subscription.model"

@Entity_()
export class User {
    constructor(props?: Partial<User>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => Subscription, e => e.user)
    subscriptions!: Subscription[]

    @DateTimeColumn_({ name: "created_at", nullable: false })
    createdAt!: Date

    @DateTimeColumn_({ name: "updated_at", nullable: false })
    updatedAt!: Date
}
