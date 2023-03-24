import { CustomerEntity } from 'src/components/customer/entities/customer.entity';
import { BaseEntity } from 'src/components/shared/entities/base.entity';
import { SquadUserEntity } from 'src/components/shared/entities/squad-user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'squadxnote', synchronize: false })
export class NoteEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'squadxnoteid' })
  noteid: string;

  @Column({ type: 'character varying', length: 80 })
  category: string;

  @Column({ type: 'text' })
  note: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    nullable: false,
  })
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @ManyToOne(() => SquadUserEntity, (squadUser) => squadUser.squaduserid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    nullable: false,
  })
  @JoinColumn({ name: 'squaduserid' })
  squaduser: SquadUserEntity;
}
