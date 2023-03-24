import { BaseSurveyPropertiesDTO } from '../dto/base.survey.properties.dto';
import { BaseSurveyResultDTO } from '../dto/base.survey.result.dto';

export interface BaseInterfaceSurvey<SurveyAnswer> {
  readonly integrationId: string;
  getProperties(): Promise<BaseSurveyPropertiesDTO>;
  calculate(answers: SurveyAnswer): Promise<BaseSurveyResultDTO>;
}
