import { Inject } from '@nestjs/common';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { AssistOmsSurveyPropertiesDTO } from './dto/assist-oms.survey.properties.dto';

export class AssistOmsSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.AssistOms);
  }

  async getProperties(): Promise<AssistOmsSurveyPropertiesDTO> {
    return super.getProperties() as Promise<AssistOmsSurveyPropertiesDTO>;
  }

  private initTotal(results: any): any {
    return Object.keys(results).reduce((total, key) => {
      total[key] = 0;
      return total;
    }, {});
  }

  private getResultDescription(total: any, results: any): string {
    const result = Object.entries(total).map(([key, value]) => {
      let stringResult = '';
      Object.entries(results[key]).forEach(
        ([resultDesciption, resultRange]) => {
          if (value >= resultRange[0] && value <= resultRange[1])
            stringResult = `${key}: ${resultDesciption} - ${value}`;
        },
      );
      return stringResult;
    });
    return result.join('\n');
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { results, weights, questions } = await this.getProperties();
    const total = this.initTotal(results);
    answers.answers.forEach(({ question, answer }) => {
      const [mainQuestion, secundaryQuestion] =
        this.extractQuestionsCodes(question);
      const index = weights[answer].change.indexOf(mainQuestion);
      total[questions[secundaryQuestion]] +=
        index < 0 ? weights[answer].value[0] : weights[answer].value[index + 1];
    });
    return {
      history: answers.answers,
      result: {
        calculateResult: <number>(
          Object.values(total).reduce(
            (amount, value) => <number>amount + <number>value,
            0,
          )
        ),
        description: this.getResultDescription(total, results),
      },
    };
  }
}
