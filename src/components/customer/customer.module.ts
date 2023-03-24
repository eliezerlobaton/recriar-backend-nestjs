import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantRequestRepository } from 'src/repositories/assistant-request.repository';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { SquadUserRepository } from 'src/repositories/squad-user.repositoy';
import { TeamSquadRepository } from 'src/repositories/team-squad.repository';
import { AssistantRequestEntity } from '../assistant-request/entities/assistant-request.entity';
import { SquadUserEntity } from '../shared/entities/squad-user.entity';
import { TeamSquadEntity } from '../teamsquad/entities/team-squad.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './entities/customer.entity';

const teamSquadRepositoryInterface = {
  provide: 'TeamSquadRepositoryInterface',
  useClass: TeamSquadRepository,
};

const customerRepositoryInterface = {
  provide: 'CustomerRepositoryInterface',
  useClass: CustomerRepository,
};

const customerServiceInterface = {
  provide: 'CustomerServiceInterface',
  useClass: CustomerService,
};

const assistantRequestRepository = {
  provide: 'AssistantRequestRepositoryInterface',
  useClass: AssistantRequestRepository,
};

const squadUserRepositoryInterface = {
  provide: 'SquadUserRepositoryInterface',
  useClass: SquadUserRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      TeamSquadEntity,
      SquadUserEntity,
      AssistantRequestEntity,
    ]),
  ],
  providers: [
    CustomerService,
    customerRepositoryInterface,
    customerServiceInterface,
    teamSquadRepositoryInterface,
    assistantRequestRepository,
    squadUserRepositoryInterface,
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
