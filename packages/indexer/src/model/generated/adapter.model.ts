import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, OneToMany as OneToMany_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Status} from "./_status"
import {Charge} from "./charge.model"

@Entity_()
export class Adapter {
    constructor(props?: Partial<Adapter>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({array: true, nullable: false})
    tokens!: (string)[]

    @Column_("varchar", {length: 8, nullable: false})
    status!: Status

    @OneToMany_(() => Charge, e => e.adapter)
    charges!: Charge[]

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date
}
