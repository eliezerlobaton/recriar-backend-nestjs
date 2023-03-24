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

@Entity({ name: 'reminder', synchronize: true })
export class ReminderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  reminderid: string;
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @ManyToOne(() => SquadUserEntity, (squadUser) => squadUser.squaduserid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'squaduserid' })
  squaduser: SquadUserEntity;

  @Column({ type: 'text', nullable: true })
  reminder: string;
}
