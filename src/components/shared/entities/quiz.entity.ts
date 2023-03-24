import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'quiz', synchronize: false })
export class QuizEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  quizid: string;

  @Column()
  title: string;

  @Column()
  integrationid: string;
}
