import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'knowledgexcustomer', synchronize: false })
export class KnowledgeXCustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  knowledgexcustomerid: string;

  @Column()
  @PrimaryColumn('uuid')
  knowledgeid: string;

  @Column()
  @PrimaryColumn('uuid')
  customerid: string;
}
