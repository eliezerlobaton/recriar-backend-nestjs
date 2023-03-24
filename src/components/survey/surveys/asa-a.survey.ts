import { Inject, Injectable } from '@nestjs/common';

import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { SimpleSurveyAnswerDTO } from './base/dto/simple.survey.answer.dto';
import { AsaASurveyPropertiesDTO } from './dto/asa-a.survey.properties.dto';

@Injectable()
export class AsaASurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.AsaA);
  }

  async getProperties(): Promise<AsaASurveyPropertiesDTO> {
    return super.getProperties() as Promise<AsaASurveyPropertiesDTO>;
  }

  private getResultDescription(total: number, results: any): string {
    let resultDescription = 'Não foi possivel calcular';
    Object.entries<number[]>(results).forEach(([key, [init, end]]) => {
      if (total >= init && total <= end)
        resultDescription = `${key} - ${total}`;
    });
    return resultDescription;
  }

  async calculate(
    answers: SimpleSurveyAnswerDTO,
  ): Promise<BaseSurveyResultDTO> {
    const { weights, results } = await this.getProperties();
    const total = answers.answers.reduce((total: any, { answer }) => {
      return total + weights[answer];
    }, 0);
    return {
      history: answers.answers,
      result: {
        calculateResult: total,
        description: this.getResultDescription(total, results),
      },
    };
  }
}
