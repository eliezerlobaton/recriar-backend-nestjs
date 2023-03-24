import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { KnowledgeConditionEntity } from './knowledge-condition.entity';
import { KnowledgeObjectiveEntity } from '../../knowledge-objective/entities/knowledge-objective.entity';

@Entity({ name: 'knowledge_objectivexknowledge_condition', synchronize: false })
export class KnowledgeObjectivexKnowledgeConditionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  knowledge_objectivexknowledge_conditionid: string;

  @ManyToOne(
    () => KnowledgeObjectiveEntity,
    (knowledgeObjective) => knowledgeObjective.knowledge_objectiveid,
  )
  @JoinColumn({ name: 'knowledgeobjectiveid' })
  knowledge_objective: KnowledgeObjectiveEntity;

  @ManyToOne(
    () => KnowledgeConditionEntity,
    (knowledgeCondition) => knowledgeCondition.knowledge_conditionid,
  )
  @JoinColumn({ name: 'knowledgeconditionid' })
  knowledge_condition: KnowledgeConditionEntity;
}
