import { BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, Entity as Entity_, Index as Index_, JoinColumn as JoinColumn_, ManyToOne as ManyToOne_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_ } from "@subsquid/typeorm-store"
import { Adapter } from "./adapter.model"
import { Merchant } from "./merchant.model"

@Entity_()
export class Relay {
    constructor(props?: Partial<Relay>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Adapter, {nullable: true})
    @JoinColumn_({ name: 'adapter_id' })
    adapter!: Adapter

    @StringColumn_({nullable: false})
    type!: string

    @BigIntColumn_({nullable: false})
    nonce!: bigint

    @StringColumn_({nullable: true})
    token!: string | undefined | null

    @BooleanColumn_({nullable: true})
    allow!: boolean | undefined | null

    @Index_()
    @ManyToOne_(() => Merchant, {nullable: true})
    @JoinColumn_({ name: 'merchant_id' })
    merchant!: Merchant | undefined | null
}
