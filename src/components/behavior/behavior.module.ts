import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BehaviorRepository } from 'src/repositories/behavior.repository';
import { BehaviorController } from './behavior.controller';
import { BehaviorService } from './behavior.service';
import { BehaviorEntity } from './entities/behavior.entity';

const behaviorService = {
  provide: 'BehaviorServiceInterface',
  useClass: BehaviorService,
};

const behaviorRepository = {
  provide: 'BehaviorRepositoryInterface',
  useClass: BehaviorRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([BehaviorEntity])],
  controllers: [BehaviorController],
  providers: [behaviorService, behaviorRepository],
})
export class BehaviorModule {}
