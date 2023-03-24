import { Module } from '@nestjs/common';
import { GuidanceService } from './guidance.service';
import { GuidanceController } from './guidance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidanceEntity } from './entities/guidance.entity';
import { GuidanceRepository } from 'src/repositories/guidance.repository';
import { BehaviorRepository } from 'src/repositories/behavior.repository';
import { BehaviorEntity } from '../behavior/entities/behavior.entity';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/config/config.service';
import { SquadUserEntity } from '../shared/entities/squad-user.entity';
import { SquadUserRepository } from 'src/repositories/squad-user.repositoy';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { SurveyRepository } from 'src/repositories/survey.repository';
import { SurveyEntity } from '../survey/entities/survey.entity';
import { FilesService } from 'src/files/files.service';
import { GetSurveyResultsUseCase } from './use-cases/get-survey-results.usecase';
import { GetGuidanceDtoUseCase } from './use-cases/get-guidance-dto.usecase';
import { CreateGuidanceUseCase } from './use-cases/create-guidance.usecase';
import { AutomaticallySendUseCase } from './use-cases/automatically-send.usecase';

const guidanceRepository = {
  provide: 'GuidanceRepositoryInterface',
  useClass: GuidanceRepository,
};

const behaviorRepository = {
  provide: 'BehaviorRepositoryInterface',
  useClass: BehaviorRepository,
};

const guidanceServiceInterface = {
  provide: 'GuidanceServiceInterface',
  useClass: GuidanceService,
};

const squadUserRepositoryInterface = {
  provide: 'SquadUserRepositoryInterface',
  useClass: SquadUserRepository,
};

const customerRepositoryInterface = {
  provide: 'CustomerRepositoryInterface',
  useClass: CustomerRepository,
};

const surveyRepositoryInterface = {
  provide: 'SurveyRepositoryInterface',
  useClass: SurveyRepository,
};

const filesServiceInterface = {
  provide: 'FilesServiceInterface',
  useClass: FilesService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuidanceEntity,
      BehaviorEntity,
      SquadUserEntity,
      CustomerEntity,
      SurveyEntity,
    ]),
    JwtModule.register({ secret: configService.getJwtSecret() }),
  ],
  controllers: [GuidanceController],
  providers: [
    guidanceRepository,
    behaviorRepository,
    guidanceServiceInterface,
    squadUserRepositoryInterface,
    customerRepositoryInterface,
    surveyRepositoryInterface,
    filesServiceInterface,
    GetSurveyResultsUseCase,
    GetGuidanceDtoUseCase,
    CreateGuidanceUseCase,
    AutomaticallySendUseCase,
  ],
  exports: [guidanceServiceInterface],
})
export class GuidanceModule {}
