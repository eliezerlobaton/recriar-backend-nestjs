import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GuidanceModule } from '../guidance/guidance.module';
import { LimesurveyResponsesModule } from '../limesurvey-response/limesurvey-responses.module';
import { SurveyModule } from '../survey/survey.module';
import { LokiIntegrationApiService } from './api/loki-integration-api.service';
import { IntegrationSchedulerService } from './integration-scheduler.service';

const lokiIntegrationApiServiceInterface = {
  provide: 'LokiIntegrationApiServiceInterface',
  useClass: LokiIntegrationApiService,
};

@Module({
  imports: [
    GuidanceModule,
    LimesurveyResponsesModule,
    SurveyModule,
    HttpModule,
  ],
  providers: [lokiIntegrationApiServiceInterface, IntegrationSchedulerService],
})
export class IntegrationSchedulerModule {}
