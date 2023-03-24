import { KnowledgeFilterQueryDTO } from '../../shared/dto/knowledge-filter-query.dto';
import { KnowledgeSubmissionDTO } from '../dto/knowledge-submission.dto';
import { NewKnowledgeSubmissionDTO } from '../dto/new-knowledge-submission.dto';
import { ResendKnowledgeSubmissionDTO } from '../dto/resend-knowledge-submission.dto';
import { UpdatedKnowledgeSubmission } from '../dto/update-knowledge-submission.dto';

export interface KnowledgeSubmissionServiceInterface {
  filterByCustomerId(
    customerId: string,
    queryParams: KnowledgeFilterQueryDTO,
  ): Promise<{ result: KnowledgeSubmissionDTO[]; hasNext: boolean }>;

  create(
    NewSubmissionBody: NewKnowledgeSubmissionDTO,
  ): Promise<KnowledgeSubmissionDTO>;

  update(
    updatedKnowledgeSubmission: UpdatedKnowledgeSubmission,
  ): Promise<KnowledgeSubmissionDTO>;

  resend(
    resendKnowledgeSubmission: ResendKnowledgeSubmissionDTO,
  ): Promise<KnowledgeSubmissionDTO>;
}
