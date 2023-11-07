// shop.entity.ts

import {Entity, Property, DateTimeType, OneToMany, ManyToOne, Collection, Rel} from '@mikro-orm/core'
import { Contact } from '../contact/contact.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Contract } from '../contract/contract.entity.js';

@Entity()
export class Shop extends BaseEntity{
   

    @Property({type: DateTimeType})
    registrationDate? = new Date()

    @Property()     
    name!: string
    
    @Property()    
    adress!: string
    
    @Property()    
    fiscalType!: string

    @Property()    
    mail!: string

    @Property({nullable: true})    
    normalPayment?: string

    @Property({nullable: true})    
    type?: string
   
    @Property({nullable: true})
    numShop?: number //ver como hacer autoincremental.

    @OneToMany(() => Contract, contract => contract.shop) //ver asundos de dependencias y cascadas
    contracts = new Collection<Contract>(this)

    @ManyToOne( () => Contact)
    contact!: Rel<Contact>
    
}