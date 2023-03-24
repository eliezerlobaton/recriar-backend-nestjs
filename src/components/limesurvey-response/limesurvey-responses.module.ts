import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LimesurveyResponseService } from './limesurvey-response.service';
import { LimesurveyResponseRepository } from '../../repositories/limesurvey-response.repository';
import { LimesurveyResponseEntity } from './entities/limesurvey-response.entity';
import { LimesurveyResponseController } from './limesurvey-response.controller';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { LimesurveyApi } from './api/limesurveyapi.service';
import { HttpModule } from '@nestjs/axios';
import { SurveyModule } from '../survey/survey.module';
import { SurveyService } from '../survey/survey.service';
import { SurveyEntity } from '../survey/entities/survey.entity';
import { GuidanceEntity } from '../guidance/entities/guidance.entity';
import { GuidanceModule } from '../guidance/guidance.module';

const limesurveyResponseRepository = {
  provide: 'LimesurveyResponseRepositoryInterface',
  useClass: LimesurveyResponseRepository,
};

const limesurveyResponseServiceInterface = {
  provide: 'LimesurveyResponseServiceInterface',
  useClass: LimesurveyResponseService,
};

const limesurveyApiInterface = {
  provide: 'LimesurveyApiServiceInterface',
  useClass: LimesurveyApi,
};

const customerRepositoryInterface = {
  provide: 'CustomerRepositoryInterface',
  useClass: CustomerRepository,
};

const surveyServiceInterface = {
  provide: 'SurveyServiceInterface',
  useClass: SurveyService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LimesurveyResponseEntity,
      CustomerEntity,
      SurveyEntity,
      GuidanceEntity,
    ]),
    HttpModule,
    SurveyModule,
    GuidanceModule,
  ],
  providers: [
    limesurveyResponseRepository,
    limesurveyResponseServiceInterface,
    customerRepositoryInterface,
    limesurveyApiInterface,
    surveyServiceInterface,
  ],
  controllers: [LimesurveyResponseController],
  exports: [limesurveyResponseServiceInterface],
})
export class LimesurveyResponsesModule {}
