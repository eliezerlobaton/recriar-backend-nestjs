import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: 'teamsquad', synchronize: false })
export class TeamSquadEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  teamsquadid: string;

  @Column({ type: 'uuid' })
  customerid: string;

  @Column({ type: 'uuid' })
  squaduserid: string;

  @Column()
  isresponsible: boolean;
}
