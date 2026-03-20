import { DateTimeColumn as DateTimeColumn_, Entity as Entity_, Index as Index_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_ } from "@subsquid/typeorm-store"
import { JoinColumn as JoinColumn_ } from "typeorm"
import { Merchant } from "./merchant.model"

@Entity_()
export class Payout {
    constructor(props?: Partial<Payout>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Merchant, {nullable: true})
    @JoinColumn_({ name: "merchant_id" }) // <-- add this line
    merchant!: Merchant

    @IntColumn_({ name: "chain_id", nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({array: true, nullable: false})
    tokens!: (string)[]

    @DateTimeColumn_({ name: "created_at", nullable: false })
    createdAt!: Date

    @DateTimeColumn_({ name: "updated_at", nullable: false })
    updatedAt!: Date
}
