import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { configService } from 'src/config/config.service';
import { LimesurveyResponseServiceInterface } from '../limesurvey-response/interfaces/limesurvey-response.service.interface';
import { LimeSurveyIds } from '../shared/dto/enums/lime-suervey-ids';
import { SurveyServiceInterface } from '../survey/interfaces/survey.service.interface';
import { IntegrationSchedulerServiceInterface } from './interfaces/integration-scheduler.service.interface';
import { LokiIntegrationApiServiceInterface } from './interfaces/loki-integration-api.service.interface';

@Injectable()
export class IntegrationSchedulerService
  implements IntegrationSchedulerServiceInterface
{
  constructor(
    @Inject('LimesurveyResponseServiceInterface')
    private readonly limesurveyService: LimesurveyResponseServiceInterface,
    @Inject('SurveyServiceInterface')
    private readonly surveyService: SurveyServiceInterface,
    @Inject('LokiIntegrationApiServiceInterface')
    private readonly lokiIntegrationApiService: LokiIntegrationApiServiceInterface,
  ) {}

  // @Cron('* 7,13 * * *')
  // @Cron(CronExpression.EVERY_10_MINUTES)
  async integrateMailChimpLimesurvey(): Promise<void> {
    const result = await this.lokiIntegrationApiService.integrate(
      configService.getMailchimpAudienceId(),
      LimeSurveyIds.Onboarding.toString(),
    );
    Logger.log(result);
  }

  getSurveyIds(): number[] {
    return Object.keys(LimeSurveyIds)
      .map((id) => parseInt(id))
      .filter((id) => id);
  }

  async integrateLimesurveyResponses(): Promise<void> {
    const surveysIds = this.getSurveyIds();
    for (const id of surveysIds) {
      try {
        await this.limesurveyService.integrateResponses(id);
      } catch (error) {
        Logger.error(error);
      }
    }
    await this.surveyService.calculateResponses();
  }
}
