import { BaseSurveyPropertiesDTO } from '../base/dto/base.survey.properties.dto';

export class DdsSurveyPropertiesDTO extends BaseSurveyPropertiesDTO {
  dimensions: string[];
  divisors: any;
}
