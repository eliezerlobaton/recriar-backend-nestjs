import { Inject } from '@nestjs/common';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';

export class IpacAdapSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.IpacAdap);
  }

  private getResultDescription(total: number, results: any): string {
    let result = 'Não foi possivel calcular';
    Object.entries(results).forEach(([key, values]) => {
      if (total >= values[0] && total <= values[1]) result = key;
    });
    return result;
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { results, weights } = await this.getProperties();
    const total = answers.answers.reduce((total: any, { answer }) => {
      return total * weights[answer];
    }, 1);
    const resultDescription = this.getResultDescription(total, results);
    return {
      history: answers.answers,
      result: {
        calculateResult: total,
        description: resultDescription,
      },
    };
  }
}
