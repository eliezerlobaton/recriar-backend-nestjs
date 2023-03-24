import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'condition', synchronize: false })
export class ConditionEntity {
  @PrimaryGeneratedColumn('uuid')
  conditionid: string[];
}
