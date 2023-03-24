import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { GuidanceRepository } from 'src/repositories/guidance.repository';
import { LimeSurveyResponseRepository } from 'src/repositories/lime-survey-response.repository';
import { SurveyRepository } from 'src/repositories/survey.repository';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { GuidanceEntity } from '../guidance/entities/guidance.entity';
import { LimesurveyResponseEntity } from '../shared/entities/limesurvey-response.entity';
import { AuditCSurvey } from './surveys/audit-c.survey';
import { DdsSurvey } from './surveys/dds.survey';
import { SurveyEntity } from './entities/survey.entity';
import { IpacAdapSurvey } from './surveys/ipac-adap.survey';
import { IrisSruvey } from './surveys/iris.survey';
import { FagerstromSurvey } from './surveys/fagerstrom.survey';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { MnaSurvey } from './surveys/mna.survey';
import { OceanSurvey } from './surveys/ocean.survey';
import { GritSurvey } from './surveys/grit.survey';
import { Phq9Survey } from './surveys/phq-9.survey';
import { WhoqolASurvey } from './surveys/whoqol-a.survey';
import { AssistOmsSurvey } from './surveys/assist-oms.survey';
import { KatzSruvey } from './surveys/katz.survey';
import { AlimentacaoMsSurvey } from './surveys/alimentacao-ms.survey';
import { AsaASurvey } from './surveys/asa-a.survey';
import { GuidanceModule } from '../guidance/guidance.module';

const surveyRepository = {
  provide: 'SurveyRepositoryInterface',
  useClass: SurveyRepository,
};

const limeSurveyReponseRepository = {
  provide: 'LimeSurveyResponseRepositoryInterface',
  useClass: LimeSurveyResponseRepository,
};

const guidanceRepository = {
  provide: 'GuidanceRepositoryInterface',
  useClass: GuidanceRepository,
};

const customerRepository = {
  provide: 'CustomerRepositoryInterface',
  useClass: CustomerRepository,
};

const surveyServiceInterface = {
  provide: 'SurveyServiceInterface',
  useClass: SurveyService,
};

const providers = [
  surveyServiceInterface,
  customerRepository,
  guidanceRepository,
  surveyRepository,
  limeSurveyReponseRepository,
  AuditCSurvey,
  Phq9Survey,
  IpacAdapSurvey,
  DdsSurvey,
  IrisSruvey,
  MnaSurvey,
  OceanSurvey,
  GritSurvey,
  FagerstromSurvey,
  WhoqolASurvey,
  AssistOmsSurvey,
  KatzSruvey,
  AlimentacaoMsSurvey,
  SurveyService,
  AsaASurvey,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyEntity,
      LimesurveyResponseEntity,
      CustomerEntity,
      GuidanceEntity,
    ]),
    GuidanceModule,
  ],
  providers: [...providers],
  controllers: [SurveyController],
  exports: [...providers],
})
export class SurveyModule {}
