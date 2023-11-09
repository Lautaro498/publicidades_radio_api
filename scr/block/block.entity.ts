import {Property,  Entity, DateTimeType} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

@Entity()
export class Block extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    numBlock!: string   

    @Property({nullable: false})
    startTime!: string
   

}