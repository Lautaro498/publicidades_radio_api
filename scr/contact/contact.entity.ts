// contact.entity.ts

import {Collection, Property, OneToMany, Entity} from '@mikro-orm/core'
import { Shop } from '../shop/shop.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Contact extends BaseEntity{

  @Property({nullable:false})
  name!: string

  @Property({nullable:false})
  lastname!: string

  @Property({nullable:false, unique: true})
  dni!: string

  @Property()
  contacts!: string[]

 @OneToMany(() => Shop, shop => shop.contact)
  shops = new Collection<Shop>(this)
}

