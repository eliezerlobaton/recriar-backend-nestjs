import { Expose } from 'class-transformer';
import { BehaviorEntity } from 'src/components/behavior/entities/behavior.entity';
import { CustomerEntity } from 'src/components/customer/entities/customer.entity';
import { AppStatus } from 'src/components/shared/dto/enums/common-enum';
import { BaseEntity } from 'src/components/shared/entities/base.entity';
import { SquadUserEntity } from 'src/components/shared/entities/squad-user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'guidance', synchronize: false })
export class GuidanceEntity extends BaseEntity {
  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  guidanceid: string;

  @Expose({ name: 'customerId' })
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid)
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @Expose({ name: 'behaviorId' })
  @ManyToOne(() => BehaviorEntity, (behavior) => behavior.behaviorid)
  @JoinColumn({ name: 'behaviorid' })
  behavior: BehaviorEntity;

  @Expose({ name: 'sendDate' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  send_date: Date;

  @Expose({ name: 'answerDate' })
  @Column({ type: 'timestamp', nullable: true })
  answer_date: Date;

  @Expose({ name: 'result' })
  @Column({ type: 'character varying', nullable: true })
  result: string;

  @Expose({ name: 'answers' })
  @Column({ type: 'jsonb', nullable: true })
  questionsxanswers: any;

  @Column({
    type: 'character varying',
    length: 15,
    default: `${AppStatus.Pending}`,
  })
  status: AppStatus;

  @Expose({ name: 'sentBy' })
  @ManyToOne(() => SquadUserEntity, (squaduser) => squaduser.squaduserid, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sent_by' })
  sent_by: SquadUserEntity;

  @Column({ type: 'uuid', nullable: false })
  responsible: string;
}
