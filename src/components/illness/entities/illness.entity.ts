import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/components/shared/entities/base.entity';
import { ConditionEntity } from 'src/components/shared/entities/condition.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'illness', synchronize: false })
export class IllnessEntity extends BaseEntity {
  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  illnessid: string;

  @Expose({ name: 'integrationId' })
  @Column({ type: 'character varying', length: 100, nullable: false })
  integrationid: string;

  @Column({ type: 'character varying', length: 150 })
  description: string;

  @ManyToMany(() => ConditionEntity, (condition) => condition.conditionid, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'illnessxcondition',
    joinColumn: { name: 'illnessid', referencedColumnName: 'illnessid' },
    inverseJoinColumn: {
      name: 'conditionid',
      referencedColumnName: 'conditionid',
    },
  })
  condition: ConditionEntity[];
}
