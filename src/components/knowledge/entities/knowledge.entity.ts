import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { KnowledgexKnowledgeObjectiveEntity } from '../../shared/entities/knowledgexknowledge-objective.entity';
import { KnowledgeType } from '../../shared/dto/enums/common-enum';
import { ScaleEntity } from 'src/components/shared/entities/scale.entity';

@Entity({ name: 'knowledge', synchronize: false })
export class KnowledgeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  knowledgeid: string;

  @Column({ type: 'character varying', length: 300, nullable: true })
  description: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  integrationid: string;

  @Column({
    type: 'character varying',
    length: 30,
  })
  knowledgetype: KnowledgeType;

  @OneToMany(
    () => KnowledgexKnowledgeObjectiveEntity,
    (knowledgexKnowledgeObjective) => knowledgexKnowledgeObjective.knowledge,
  )
  knowledgexknowledge_objectives: KnowledgexKnowledgeObjectiveEntity[];

  @ManyToOne(() => ScaleEntity, (scale) => scale.scaleid, { eager: true })
  @JoinColumn({ name: 'scaleid' })
  scale: ScaleEntity;
}
