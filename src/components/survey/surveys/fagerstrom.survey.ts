import { Inject, Injectable } from '@nestjs/common';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { SimpleSurveyAnswerDTO } from './base/dto/simple.survey.answer.dto';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';

@Injectable()
export class FagerstromSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Fagerstrom);
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
        description: results[total],
      },
    };
  }
}
