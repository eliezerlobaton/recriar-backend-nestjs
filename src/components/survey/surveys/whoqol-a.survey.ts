import { Inject } from '@nestjs/common';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { BaseSurveyAnswerDTO } from './base/dto/base.survey.answer.dto';
import { BaseSurveyResultDTO } from './base/dto/base.survey.result.dto';
import { WhoqolASurveyPropertiesDTO } from './dto/whoqol-a.survey.proporties.dto';

export class WhoqolASurvey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.WhoqolA);
  }

  async getProperties(): Promise<WhoqolASurveyPropertiesDTO> {
    return (await super.getProperties()) as WhoqolASurveyPropertiesDTO;
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
  ): string[] {
    const results: Array<string> = [];
    Object.entries(dimensions).forEach(([key, value]) => {
      const result = (<string[]>value).includes(question);
      if (result) results.push(key);
    });
    return results;
  }

  private incrementWeightDimension(
    amount: number,
    weights: any,
    question: string,
    answer: string,
  ): number {
    const index = weights[answer].reversed.includes(question) ? 1 : 0;
    return amount + weights[answer].values[index];
  }

  private operateOverTotal(total, operationFunc: any, ...args) {
    return Object.entries(total).reduce(
      (result: any, [key, value]) => operationFunc(result, key, value, ...args),
      {},
    );
  }

  private calculateAverage(total: any, dimensions: any): any {
    return this.operateOverTotal(
      total,
      (result: any, key: string, value: number, dimensions: any) => {
        result[key] = <number>value / dimensions[key].length;
        return result;
      },
      dimensions,
    );
  }

  private multiplyBy(total: any, multiplier: number): any {
    return this.operateOverTotal(
      total,
      (result: any, key: string, value: number, multiplier: number) => {
        result[key] = <number>value * multiplier;
        return result;
      },
      multiplier,
    );
  }

  private subtract(total: any, subtrahend: number): any {
    return this.operateOverTotal(
      total,
      (result: any, key: string, value: number, subtrahend: number) => {
        result[key] = <number>value - subtrahend;
        return result;
      },
      subtrahend,
    );
  }

  private calulatePipe(total, args: any[], ...functions): any {
    return functions.reduce(
      (total, func) => func.bind(this)(total, args.shift()),
      total,
    );
  }

  async calculate(answers: BaseSurveyAnswerDTO): Promise<BaseSurveyResultDTO> {
    const { weights, results, dimensions } = await this.getProperties();

    const total = this.initializeDimensionsValues(dimensions);
    answers.answers.forEach(({ answer, question }) => {
      const questionsCodes = this.extractQuestionsCodes(question);

      const dimensionsKeys = this.selecetDimensionToIncrement(
        dimensions,
        questionsCodes[0],
      );

      dimensionsKeys.forEach((dimensionsKey) => {
        total[dimensionsKey] = this.incrementWeightDimension(
          total[dimensionsKey],
          weights,
          question,
          answer,
        );
      });
    });

    const totalCalculated = this.calulatePipe(
      total,
      [dimensions, 4, 4, 6.25],
      this.calculateAverage,
      this.multiplyBy,
      this.subtract,
      this.multiplyBy,
    );
    const resultDescription = this.getResultDescription(
      totalCalculated,
      results,
    );

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
