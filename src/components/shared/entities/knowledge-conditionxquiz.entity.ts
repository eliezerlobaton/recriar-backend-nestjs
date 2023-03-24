import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { KnowledgeConditionEntity } from './knowledge-condition.entity';
import { QuizEntity } from './quiz.entity';

@Entity({ name: 'knowledge_conditionxquiz', synchronize: false })
export class KnowledgeConditionxQuizEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  knowledge_conditionxquizid: string;

  @ManyToOne(
    () => KnowledgeConditionEntity,
    (knowledgeCondition) => knowledgeCondition.knowledge_conditionid,
  )
  @JoinColumn({ name: 'knowledgeconditionid' })
  knowledge_condition: KnowledgeConditionEntity;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.quizid)
  @JoinColumn({ name: 'quizid' })
  quiz: QuizEntity;
}
