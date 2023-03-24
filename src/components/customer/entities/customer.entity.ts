import { BaseEntity } from '../../../components/shared/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customer', synchronize: false })
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  customerid: string;

  @Column()
  integrationid: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  status: boolean;

  @Column({ array: true })
  quizcodes: string;

  @Column()
  gender: string;

  @Column()
  cpf: string;

  @Column()
  cellphone: string;

  @Column()
  telephone: string;
}
