import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { ContentSubmissionFilterQueryDTO } from '../dto/content-submission-filter-query.dto';
import { ContentSubmissionDTO } from '../dto/content-submission.dto';
import { NewContentSubmissionDTO } from '../dto/new-content-submission.dto';
import { UpdateContentSubmissionDTO } from '../dto/update-content-submission.dto';

export interface ContentSubmissionServiceInterface {
  NewContentSubmission(
    newSubmission: NewContentSubmissionDTO,
  ): Promise<ContentSubmissionDTO>;
  GetByCustomer(
    customerId: string,
    queryParams: ContentSubmissionFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentSubmissionDTO[]>>;
  update(
    updatedContentSubmission: UpdateContentSubmissionDTO,
  ): Promise<ContentSubmissionDTO>;
}
