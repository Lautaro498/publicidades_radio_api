import { DateTimeType, Entity, ManyToOne, Rel, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Contract } from "../contract/contract.entity.js";

@Entity()
export class Order extends BaseEntity {
    @Property()
    numOrder?: string

    @Property({type: DateTimeType})
    regDate?= new Date() 

    @Property()
    totalAds?: number //calculado

    @Property()
    daysAmount?: number // calculado

     @Property()
     nameStrategy?: string

     @Property()
     totalCost?: number //calculado

     @Property()
     dailyCost?: number // calculado

     @Property()
     obs?: string

     @Property()
     showName?: string 

     @Property()
     liq: boolean = false

     @Property()
     month?: string // deberia ser MM-AAAA

     @ManyToOne( ()=> Contract)
     contract!: Rel<Contract>
     
     //@ManyToOne (() => Spot)
     //spot!: Rel<Spot>


}