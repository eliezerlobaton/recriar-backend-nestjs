import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { MailchimpApiController } from './mailchimp-api.controller';
import { MailchimpApiService } from './mailchimp-api.service';

const mailchimpApiService = {
  provide: 'MailchimpApiServiceInterface',
  useClass: MailchimpApiService,
};

const customerRepository = {
  provide: 'CustomerRepositoryInterface',
  useClass: CustomerRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [MailchimpApiController],
  providers: [mailchimpApiService, customerRepository],
})
export class MailchimpApiModule {}
