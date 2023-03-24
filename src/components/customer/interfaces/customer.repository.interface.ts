import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { CustomerEntity } from '../entities/customer.entity';

export type CustomerRepositoryInterface =
  BaseInterfaceRepository<CustomerEntity>;
