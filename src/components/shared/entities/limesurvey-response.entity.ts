import { Expose } from 'class-transformer';
import { CustomerEntity } from 'src/components/customer/entities/customer.entity';
import { LSQuestionAndAnswerDTO } from 'src/components/shared/dto/question-n-anwser.dto';
import { BaseEntity } from 'src/components/shared/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'limesurvey_response', synchronize: false })
export class LimesurveyResponseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  limesurvey_responseid: string;

  @Expose({ name: 'surveyId' })
  @Column({ name: 'surveyid', type: 'integer' })
  surveyId: number;

  @Column({ name: 'responses', type: 'jsonb' })
  responses: LSQuestionAndAnswerDTO;

  @Column({ name: 'questions', type: 'jsonb' })
  questions: LSQuestionAndAnswerDTO;

  @Expose({ name: 'customerId' })
  @ManyToOne(() => CustomerEntity, (customer) => customer.customerid)
  @JoinColumn({ name: 'customerid' })
  customer: CustomerEntity;

  @Column({ name: 'responseid' })
  responseId: number;

  @Column({ name: 'submitdate', nullable: true })
  submitDate: Date;

  @Column({ name: 'lastpage', nullable: true })
  lastPage: number;

  @Column({ name: 'startlanguage', nullable: true })
  startLanguage: string;

  @Column({ nullable: true })
  seed: string;
}
