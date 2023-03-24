import { Inject } from '@nestjs/common';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';

export class IrisSruvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Iris);
  }

  private getResultDescription(total: number, results: any): string {
    let result = 'Não foi possivel calcular';
    if (total > 20) total = 20;
    Object.entries(results).forEach(([key, values]) => {
      if (total >= values[0] && total <= values[1]) result = key;
    });
    return result;
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { weights, results } = await this.getProperties();

    const total = answers.answers.reduce((total: any, { answer, question }) => {
      const questionsCodes = this.extractQuestionsCodes(question);
      return total + weights[questionsCodes.pop()][answer];
    }, 0);
    const resultDescription = this.getResultDescription(total, results);
    return {
      history: answers.answers,
      result: {
        calculateResult: total > 20 ? 20 : total,
        description: resultDescription,
      },
    };
  }
}
