import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
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

@Entity({ name: 'scheduled_attendance', synchronize: false })
export class ScheduledAttendanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  scheduled_attendanceid: string;

  @Expose({ name: 'squadUserId' })
  @ManyToOne(() => SquadUserEntity, (squaduser) => squaduser.squaduserid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'squaduserid' })
  squaduser: SquadUserEntity;

  @Expose({ name: 'customerId' })
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @Column({ type: 'text' })
  event_uri: string;

  @Column({ type: 'text' })
  name: string;

  @Column()
  status: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ type: 'text' })
  event_type: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  attendance_url?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  recording_url?: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: false, unique: true })
  event_id: string;
}
