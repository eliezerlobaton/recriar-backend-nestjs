import { Inject, Logger } from '@nestjs/common';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { MnaSurveyPropertiesDTO } from './dto/mna.survey.properties.dto';

export class MnaSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Mna);
  }

  async getProperties(): Promise<MnaSurveyPropertiesDTO> {
    return (await super.getProperties()) as MnaSurveyPropertiesDTO;
  }

  private getResultDescription(total: any, results): string {
    const result = [];
    const [key] = Object.keys(results).filter(
      (key) => !Object.keys(total).includes(key),
    );
    total[key] = Object.values(total).reduce(
      (total: number, value: number) => total + value,
      0,
    );
    Object.entries(results).forEach(([key, values]) => {
      Object.entries(values).forEach(([resultkey, resultValue]) => {
        if (total[key] >= resultValue[0] && total[key] <= resultValue[1]) {
          result.push(`${key}: ${resultkey} - ${total[key]}`);
        }
      });
    });
    return result.join('\n');
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { questions, results, weights } = await this.getProperties();
    const total = {};

    Object.values(questions).forEach(
      (question: string) => (total[question] = 0),
    );

    answers.answers.forEach(({ answer, question }) => {
      const questionsCodes = this.extractQuestionsCodes(question);
      total[questions[questionsCodes[0]]] =
        total[questions[questionsCodes[0]]] + weights[answer];
    });
    Logger.log(total);
    const resultDescription = this.getResultDescription(total, results);
    return {
      history: answers.answers,
      result: {
        calculateResult: Math.max(...(<number[]>Object.values(total))),
        description: resultDescription,
      },
    };
  }
}
