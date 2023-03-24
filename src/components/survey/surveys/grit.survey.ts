import { Inject, Injectable } from '@nestjs/common';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';

@Injectable()
export class GritSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Grit);
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { weights, results } = await this.getProperties();
    const total = answers.answers.reduce((total: any, { answer }) => {
      return total + weights[answer];
    }, 0);
    const result = total / answers.answers.length;
    const { description } = results.find(
      (condition) => result >= condition.min && result < condition.max,
    );

    return {
      history: answers.answers,
      result: {
        calculateResult: result,
        description: description,
      },
    };
  }
}
