import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionRepository } from 'src/repositories/condition.repository';

import { ConditionEntity } from '../shared/entities/condition.entity';
import { IllnessRepository } from './../../repositories/illness.repository';
import { IllnessEntity } from './entities/illness.entity';
import { IllnessController } from './illness.controller';
import { IllnessService } from './illness.service';

const illnessRepopsitory = {
  provide: 'IllnessRepositoryService',
  useClass: IllnessRepository,
};

const conditionRepository = {
  provide: 'ConditionRepositoryService',
  useClass: ConditionRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([IllnessEntity, ConditionEntity])],
  controllers: [IllnessController],
  providers: [IllnessService, illnessRepopsitory, conditionRepository],
})
export class IllnessModule {}
