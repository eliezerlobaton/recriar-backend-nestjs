export interface LimesurveyApiServiceInterface {
  getSurveyResponses(
    surveyId: number,
    questionFormat: 'full' | 'code' | 'abbreviated',
    responseFormat: 'short' | 'long',
  ): Promise<any[]>;
}
