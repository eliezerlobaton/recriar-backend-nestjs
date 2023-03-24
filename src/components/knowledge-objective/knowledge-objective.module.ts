import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { KnowledgeConditionRepository } from 'src/repositories/knowledge-condition.repository';
import { KnowledgeObjectiveRepository } from 'src/repositories/knowledge-objective.repository';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { KnowledgeConditionEntity } from '../shared/entities/knowledge-condition.entity';
import { KnowledgeObjectiveEntity } from './entities/knowledge-objective.entity';
import { KnowledgeObjectiveController } from './knowledge-objective.controller';
import { KnowledgeObjectiveService } from './knowledge-objective.service';

const KnowledgeObjectiveServiceInterface = {
  provide: 'KnowledgeObjectiveServiceInterface',
  useClass: KnowledgeObjectiveService,
};

const customerRepository = {
  provide: 'CustomerRepositoryInterface',
  useClass: CustomerRepository,
};

const knowledgeConditionRepository = {
  provide: 'KnowledgeConditionRepository',
  useClass: KnowledgeConditionRepository,
};

const knowledgeObjectiveRepository = {
  provide: 'KnowledgeObjectiveRepository',
  useClass: KnowledgeObjectiveRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KnowledgeObjectiveEntity,
      CustomerEntity,
      KnowledgeConditionEntity,
    ]),
  ],
  providers: [
    KnowledgeObjectiveServiceInterface,
    customerRepository,
    knowledgeConditionRepository,
    knowledgeObjectiveRepository,
  ],
  controllers: [KnowledgeObjectiveController],
})
export class KnowledgeObjectiveModule {}
