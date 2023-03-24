import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: 'survey', synchronize: false })
export class SurveyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  surveyid: string;

  @Column({ type: 'character varying', unique: true })
  integrationid: string;

  @Column({
    type: 'jsonb',
  })
  properties: any;
}
