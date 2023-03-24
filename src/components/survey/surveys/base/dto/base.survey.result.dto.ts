export class BaseSurveyResultDTO {
  history: Array<{
    question: string;
    answer: number | string;
    description?: string;
  }>;
  result: {
    calculateResult: number;
    description: string;
  };
}
