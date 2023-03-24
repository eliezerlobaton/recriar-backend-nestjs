import { Inject, Injectable } from '@nestjs/common';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { DdsSurveyPropertiesDTO } from './dto/dds.survey.properties.dto';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';

@Injectable()
export class DdsSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Dds);
  }

  async getProperties(): Promise<DdsSurveyPropertiesDTO> {
    return <DdsSurveyPropertiesDTO>(<unknown>await super.getProperties());
  }

  private buildDescription(answers: any, results: string[]): string {
    return Object.entries(answers)
      .map(([key, value]) => {
        return `${key}: ${value} - ${results[value as number]}`;
      })
      .join('\n');
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { results, weights, dimensions, divisors } =
      await this.getProperties();
    const total = {
      'Score total': 0,
    };
    answers.answers.forEach(({ answer }, index: number) => {
      total[dimensions[index]] =
        total[dimensions[index]] !== undefined
          ? total[dimensions[index]] + weights[answer]
          : weights[answer];
      total['Score total'] = total['Score total'] + weights[answer];
    });
    Object.entries(total).forEach(([key, value]) => {
      total[key] = Math.round(value / divisors[key]);
    });
    return {
      history: answers.answers,
      result: {
        calculateResult: total['Score total'],
        description: this.buildDescription(total, results),
      },
    };
  }
}
