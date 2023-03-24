import { Expose } from 'class-transformer';
import { BaseEntity } from 'src/components/shared/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BehaviorType } from '../enum/behavior-type.enum';

@Entity({ name: 'behavior', synchronize: false })
export class BehaviorEntity extends BaseEntity {
  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  behaviorid: string;

  @Expose({ name: 'integrationId' })
  @Column({ type: 'character varying', length: 100, nullable: true })
  integrationid: string;

  @Expose({ name: 'behaviorType' })
  @Column({ type: 'character varying', default: `${BehaviorType.Form}` })
  behavior_type: BehaviorType;

  @Expose()
  @Column({ type: 'character varying', length: 150 })
  description: string;

  @Expose({ name: 'formLink' })
  @Column({ type: 'character varying', nullable: true, unique: true })
  link: string;

  @Expose({ name: 'activityText' })
  @Column({ type: 'text', nullable: true })
  activity_text: string;

  @Expose({ name: 'automaticSend' })
  @Column({ type: 'boolean', nullable: true })
  automatic_send: boolean;
}
