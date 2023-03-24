import { Inject } from '@nestjs/common';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { OceanSurveyPropertiesDTO } from './dto/ocean.survey.properties.dto';

export class OceanSurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Ocean);
  }

  async getProperties(): Promise<OceanSurveyPropertiesDTO> {
    return (await super.getProperties()) as OceanSurveyPropertiesDTO;
  }

  private getResultDescription(total: any, results): string {
    const result = [];
    Object.entries(total).forEach(([key, value]) => {
      Object.entries(results).forEach(([resultDescription, valueRange]) => {
        const [min, max] = <number[]>valueRange;
        if (value >= min && value <= max)
          result.push(`${key}: ${resultDescription} - ${value}`);
      });
    });
    return result.join('\n');
  }

  private initializeDimensionsValues(dimensions: any): any {
    return Object.keys(dimensions).reduce((total, key) => {
      total[key] = 0;
      return total;
    }, {});
  }

  private selecetDimensionToIncrement(
    dimensions: any,
    question: string,
  ): string {
    const [key] = <string[]>Object.entries(dimensions)
      .filter(([key, value]) => {
        const result = (<string[]>value).includes(question);
        if (result) return key;
      })
      .pop();
    return <string>key;
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { weights, results, dimensions } = await this.getProperties();

    const total = this.initializeDimensionsValues(dimensions);
    answers.answers.forEach(({ answer, question }) => {
      const questionsCodes = this.extractQuestionsCodes(question);
      const dimensionsKey = this.selecetDimensionToIncrement(
        dimensions,
        questionsCodes[1],
      );
      total[dimensionsKey] = total[dimensionsKey] + weights[answer];
    });
    const resultDescription = this.getResultDescription(total, results);
    return {
      history: answers.answers,
      result: {
        calculateResult: <number>(
          Object.values(total).reduce(
            (result: number, value: number) => result + value,
            0,
          )
        ),
        description: resultDescription,
      },
    };
  }
}
