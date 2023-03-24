import { Inject } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { capitalizeString } from 'src/components/shared/lib/common-functions';
import { SurveyRepositoryInterface } from 'src/components/survey/interfaces/survey.repository.interface';
import { SurveyResultDTO } from '../dto/survey-result.dto';

export class GetSurveyResultsUseCase implements UseCase<SurveyResultDTO[]> {
  constructor(
    @Inject('SurveyRepositoryInterface')
    private readonly surveyRepository: SurveyRepositoryInterface,
  ) {}

  async execute(
    integrationId: string,
    results: string[],
  ): Promise<SurveyResultDTO[]> {
    if (!(results.length > 0)) return [];
    const [survey] = await this.surveyRepository.findByCondition({
      integrationid: integrationId,
    });
    const surveyResults: SurveyResultDTO[] = [];
    if (!survey?.properties) return [];
    if (!survey.properties?.app) return [];
    Object.entries(survey.properties.app.results).forEach(([key, value]) => {
      results.forEach((result) => {
        if (result.toLowerCase().match(key.toLowerCase()))
          surveyResults.push({
            description: capitalizeString(<string>value),
            imageUrl: survey.properties?.images
              ? survey.properties.images[key]
              : '',
            text: survey.properties.app.texts[<string>value],
          });
      });
    });
    return surveyResults;
  }
}
