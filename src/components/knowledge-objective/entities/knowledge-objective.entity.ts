import { KnowledgeType } from '../../shared/dto/enums/common-enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { KnowledgeObjectivexKnowledgeConditionEntity } from '../../shared/entities/knowledge_objectivexknowledge_condition.entity';

@Entity({ name: 'knowledge_objective', synchronize: false })
export class KnowledgeObjectiveEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  knowledge_objectiveid: string;

  @Column()
  description: string;

  @Column()
  integrationid: string;

  @Column({ type: 'character varying', length: 30 })
  knowledgetype: KnowledgeType;

  @OneToMany(
    () => KnowledgeObjectivexKnowledgeConditionEntity,
    (objectiveXCondition) => objectiveXCondition.knowledge_objective,
  )
  knowledge_objectivexknowledge_condition: KnowledgeObjectivexKnowledgeConditionEntity[];
}
