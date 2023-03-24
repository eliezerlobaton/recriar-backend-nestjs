import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'scale', synchronize: false })
export class ScaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  scaleid: string;

  @Column()
  description: string;

  @Column()
  integrationid: string;

  @Column({ array: true })
  scales: string;
}
