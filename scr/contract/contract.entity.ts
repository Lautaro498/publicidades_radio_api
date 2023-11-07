// contract.entity.ts

import {Property, ManyToOne, DateTimeType, Entity, Rel} from '@mikro-orm/core';
import { Shop } from '../shop/shop.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Contract extends BaseEntity{
    
   // @Property()
   // numContract!: string   //ver como hacer funcionar autoncremental.
 
    @Property({type: DateTimeType})
    registrationDate? = new Date()

    @Property({type: DateTimeType})
    dateFrom!: Date  
    dateTo?: Date   

    @Property({nullable: true})
    observations?: string


   

  @ManyToOne(() => Shop)
  shop!: Rel<Shop>

}