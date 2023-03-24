import { BaseSurveyAnswerDTO } from './dto/base.survey.answer.dto';
import { SurveyRepositoryInterface } from '../../interfaces/survey.repository.interface';
import { BaseSurveyPropertiesDTO } from './dto/base.survey.properties.dto';
import { BaseInterfaceSurvey } from './interfaces/base.interface.form';
import { BaseSurveyResultDTO } from './dto/base.survey.result.dto';

export abstract class BaseAbstractSurvey
  implements BaseInterfaceSurvey<BaseSurveyAnswerDTO>
{
  constructor(
    readonly surveyRepository: SurveyRepositoryInterface,
    readonly integrationId: string,
  ) {}

  protected extractQuestionsCodes(question: string): string[] {
    const re = /[A-Z]{3}[0-9]{4}/g;
    const match = question.match(re);
    return match;
  }

  async getProperties(): Promise<BaseSurveyPropertiesDTO> {
    const { properties } = await this.surveyRepository.findOneByCondition({
      integrationid: this.integrationId,
    });
    return properties;
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { weights, results } = await this.getProperties();
    const total = answers.answers.reduce((total: any, { answer }) => {
      return total + weights[answer];
    }, 0);
    return {
      history: answers.answers,
      result: {
        calculateResult: total,
        description: results[answers.gender][total],
      },
    };
  }
}
