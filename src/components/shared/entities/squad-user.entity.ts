import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'squaduser', synchronize: false })
export class SquadUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  squaduserid: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  functionalrole: string;

  @Column()
  role: string;

  @Column()
  image: string;
}
