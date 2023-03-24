import { Inject } from '@nestjs/common';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { AlimentacaoMsSurveyPropertiesDTO } from './dto/alimentacao-ms.survey.properties.dto';

export class AlimentacaoMsSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.AlimentacaoMs);
  }

  async getProperties(): Promise<AlimentacaoMsSurveyPropertiesDTO> {
    return super.getProperties() as Promise<AlimentacaoMsSurveyPropertiesDTO>;
  }

  private getResultDescription(total: number, results: any): string {
    let resultDescription = 'Não foi possivel calcular';
    Object.entries<number[]>(results).forEach(([key, [init, end]]) => {
      if (total >= init && total <= end)
        resultDescription = `${key} - ${total}`;
    });
    return resultDescription;
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { results, weights, reversed } = await this.getProperties();
    const total = answers.answers.reduce(
      (amount: number, { question, answer }) => {
        const index = reversed.includes(question) ? 1 : 0;
        return (amount += weights[answer].values[index]);
      },
      0,
    );
    return {
      history: answers.answers,
      result: {
        calculateResult: total,
        description: this.getResultDescription(total, results),
      },
    };
  }
}
