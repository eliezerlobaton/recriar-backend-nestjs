import { CustomerEntity } from '../../../components/customer/entities/customer.entity';
import { BaseEntity } from '../../../components/shared/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { KnowledgeEntity } from '../../knowledge/entities/knowledge.entity';
import { Expose } from 'class-transformer';
import { KnowledgeSubmissionStatus } from 'src/components/shared/dto/enums/common-enum';
import { KnowledgeObjectiveEntity } from 'src/components/knowledge-objective/entities/knowledge-objective.entity';

@Entity({ name: 'knowledge_submission', synchronize: false })
export class KnowledgeSubmissionEntity extends BaseEntity {
  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  knowledge_submissionid: string;

  @Expose({ name: 'squadUserToken' })
  @Column({ type: 'varchar', nullable: true })
  squad_userid: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 15,
    default: `${KnowledgeSubmissionStatus.Pending}`,
  })
  status: KnowledgeSubmissionStatus;

  @Expose()
  @Column({ nullable: true })
  answer: number;

  @Expose({ name: 'answerDate' })
  @Column({ type: 'timestamp', nullable: true })
  answer_date: Date;

  @Expose({ name: 'sendDate' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  send_date: Date;

  @Expose({ name: 'customerId' })
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid, {
    eager: true,
  })
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @Expose({ name: 'knowledgeId' })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.knowledgeid, {
    eager: true,
  })
  @JoinColumn({ name: 'knowledgeid' })
  knowledge: KnowledgeEntity;

  @ManyToOne(
    () => KnowledgeObjectiveEntity,
    (knowledgeObjective) => knowledgeObjective.knowledge_objectiveid,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'knowledge_objectiveid' })
  knowledge_objective: KnowledgeObjectiveEntity;
}
