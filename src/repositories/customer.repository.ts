import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/components/customer/entities/customer.entity';
import { CustomerRepositoryInterface } from 'src/components/customer/interfaces/customer.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class CustomerRepository
  extends BaseAbstractRepository<CustomerEntity>
  implements CustomerRepositoryInterface
{
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {
    super(customerRepository);
  }
}
