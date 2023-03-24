import { Get, Logger, Param, Render, Req } from '@nestjs/common';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SurveyServiceInterface } from '../survey/interfaces/survey.service.interface';
import { LimesurveyIntegrationPostBodyDTO } from './dto/limesurvey-integration-post-body.dto';
import { LimesurveyResponseServiceInterface } from './interfaces/limesurvey-response.service.interface';

@ApiTags('LimesurveyIntegration')
@Controller('limesurveyintegration')
export class LimesurveyResponseController {
  constructor(
    @Inject('LimesurveyResponseServiceInterface')
    private readonly limesurveyResponseService: LimesurveyResponseServiceInterface,
    @Inject('SurveyServiceInterface')
    private readonly surveyService: SurveyServiceInterface,
  ) {}

  @Get('integrate-responses/:surveyid')
  // @Render('limesurvey-response')
  async integrateAndCalculateResponses(@Param('surveyid') surveyId: string) {
    try {
      const results = await this.limesurveyResponseService.integrateResponses(
        parseInt(surveyId),
      );
    } catch (error) {
      Logger.error(error, 'limesurvey-response');
      console.log(error);
    }
    const responses = await this.surveyService.calculateResponses();
    const lastGuidance =
      this.surveyService.getLastCalculatedResponse(responses);

    return {
      surveyResults: lastGuidance
        ? lastGuidance.surveyResults
        : [
            {
              description: 'Sem resultado',
              text: 'nenhum resultado condizente foi calculado',
            },
          ],
    };
  }

  @Get('results/:surveyid')
  @Render('limesurvey-response')
  async getResponses(@Param('surveyid') surveyId: string, @Req() request) {
    return { surveyId: surveyId, host: request.get('host') };
  }

  @Post('integrate-responses')
  async integrateResponses(@Body() body: LimesurveyIntegrationPostBodyDTO) {
    const resultPromises = body.surveysIds.map(async (survey) => {
      const result = await this.limesurveyResponseService.integrateResponses(
        survey,
      );
      return result;
    });
    const result = await Promise.all(resultPromises);
    const responses = await this.surveyService.calculateResponses();
    return {
      integrationResult: result,
      calculatedResponses: responses,
    };
  }
}
