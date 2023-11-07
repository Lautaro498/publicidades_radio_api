// contact.entity.ts

import {Collection, Property, OneToMany, Entity} from '@mikro-orm/core'
import { Shop } from '../shop/shop.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Contact extends BaseEntity{


  @Property({nullable:false, unique: true})
  dni!: string

  @Property()
  name!: string

  @Property()
  surname!: string

  @Property()
  phone!: string

 @OneToMany(() => Shop, shop => shop.contact)
  shops = new Collection<Shop>(this)
}

