import { Expose } from 'class-transformer';
import { CustomerEntity } from 'src/components/customer/entities/customer.entity';
import { BaseEntity } from 'src/components/shared/entities/base.entity';
import { SquadUserEntity } from 'src/components/shared/entities/squad-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'assistant_request', synchronize: false })
export class AssistantRequestEntity extends BaseEntity {
  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  assistant_requestid: string;

  @Expose({ name: 'customerId' })
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @Expose({ name: 'assistantId' })
  @ManyToOne(() => SquadUserEntity, (assistant) => assistant.squaduserid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'assistantid' })
  assistant: SquadUserEntity;

  @Expose({ name: 'responsibleId' })
  @ManyToOne(() => SquadUserEntity, (responsible) => responsible.squaduserid, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'responsibleid' })
  responsible: SquadUserEntity;

  @Expose({ name: 'startDate' })
  @CreateDateColumn()
  start_date: Date;

  @Expose({ name: 'endDate' })
  @Column({ nullable: true })
  end_date?: Date;

  @Expose({ name: 'responsibleMessage' })
  @Column({ type: 'text' })
  responsible_message: string;
}
