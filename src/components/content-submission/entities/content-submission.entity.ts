import { BaseEntity } from '../../../components/shared/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContentEntity } from '../../content/entities/content.entity';
import { CustomerEntity } from '../../customer/entities/customer.entity';
import { Exclude, Expose } from 'class-transformer';
import { ContentSubmissionStatus } from 'src/components/shared/dto/enums/common-enum';
import { KnowledgeEntity } from 'src/components/knowledge/entities/knowledge.entity';
import { KnowledgeObjectiveEntity } from 'src/components/knowledge-objective/entities/knowledge-objective.entity';

@Entity({ name: 'content_submission', synchronize: false })
export class ContentSubmissionEntity extends BaseEntity {
  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  content_submissionid: string;

  @Expose({ name: 'squadUserToken' })
  @Column({ type: 'varchar' })
  squad_userid: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 15,
    default: `${ContentSubmissionStatus.NotRead}`,
  })
  status: ContentSubmissionStatus;

  @Expose({ name: 'ratingDate' })
  @Column({ type: 'timestamp', nullable: true })
  rating_date: Date;

  @Expose({ name: 'sendDate' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  send_date: Date;

  @Expose()
  @Column({ nullable: true })
  rating: number;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  reading_date: Date;

  @Column({ type: 'boolean', default: false })
  is_favorite: boolean;

  @Expose({ name: 'contentId' })
  @ManyToOne(() => ContentEntity, (content) => content.contentid)
  @JoinColumn({ name: 'contentid' })
  content: ContentEntity;

  @Expose({ name: 'customerId' })
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid)
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @Expose({ name: 'knowledgeId' })
  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.knowledgeid)
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
