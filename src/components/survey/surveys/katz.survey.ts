import { Inject } from '@nestjs/common';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';

export class KatzSruvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Katz);
  }

  private initTotal(results): any {
    return Object.keys(results).reduce((total, key) => {
      total[key] = 0;
      return total;
    }, {});
  }

  private incrementScores(total: any, answers: any[], results: any): any {
    answers.forEach(({ answer }) => {
      Object.entries(results).forEach(([key, value]) => {
        total[key] = (<string[]>(<any>value).answerSet).includes(answer)
          ? total[key] + 1
          : total[key];
        total[key] = (<string[]>(<any>value).exceptions).includes(answer)
          ? total[key] - 10
          : total[key];
      });
    });
    return total;
  }

  private getResultDescription(
    total: any,
    results: any,
  ): { description: string; score: number } {
    const [key] = Object.entries(total)
      .filter(([key, value]) => {
        return results[key].score <= value;
      })
      .shift();

    return {
      description: `${key} ${results[key].description}`,
      score: total[key],
    };
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { results } = await this.getProperties();
    const total = this.incrementScores(
      this.initTotal(results),
      answers.answers,
      results,
    );
    const { description, score } = this.getResultDescription(total, results);
    return {
      history: answers.answers,
      result: {
        description,
        calculateResult: score,
      },
    };
  }
}
