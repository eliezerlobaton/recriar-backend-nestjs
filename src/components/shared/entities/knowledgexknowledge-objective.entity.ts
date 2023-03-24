import { KnowledgeEntity } from '../../knowledge/entities/knowledge.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { KnowledgeObjectiveEntity } from '../../knowledge-objective/entities/knowledge-objective.entity';

@Entity({ name: 'knowledgexknowledge_objective', synchronize: false })
export class KnowledgexKnowledgeObjectiveEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  knowledgexknowledge_objectiveid: string;

  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.knowledgeid)
  @JoinColumn({ name: 'knowledgeid' })
  knowledge: KnowledgeEntity;

  @ManyToOne(
    () => KnowledgeObjectiveEntity,
    (knowledgeObjective) => knowledgeObjective.knowledge_objectiveid,
  )
  @JoinColumn({ name: 'knowledgeobjectiveid' })
  knowledgeobjective: KnowledgeObjectiveEntity;
}
