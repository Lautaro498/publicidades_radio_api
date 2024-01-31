import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core"
import { Block } from "../block/block.entity.js"
import { Order } from "./order.entity.js"

@Entity()
export class OrderBlockDate {

    @Property({nullable: false})
    date!: Date

    @ManyToOne (()=> Block)
    block!: Rel<Block>

    @ManyToOne (()=> Order)
    order!: Rel<Order>
}