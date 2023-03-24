import { IsUUID } from 'class-validator';
import { LSQuestionAndAnswerDTO } from 'src/components/shared/dto/question-n-anwser.dto';
import { LimesurveyResponseEntity } from '../entities/limesurvey-response.entity';

export class LimesurveyResponseDTO {
  limesurveyresponse_id: string;

  @IsUUID()
  customer: string;

  responses: LSQuestionAndAnswerDTO[];

  questions: LSQuestionAndAnswerDTO[];

  surveyId: number;

  responseId: number;

  submitDate: Date;

  lastPage: number;

  startLanguage: string;

  seed: number;
}
