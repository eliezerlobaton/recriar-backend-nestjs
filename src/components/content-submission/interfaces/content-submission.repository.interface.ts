import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { ContentSubmissionFilterQueryDTO } from '../dto/content-submission-filter-query.dto';
import { ContentSubmissionEntity } from '../entities/content-submission.entity';

export interface ContentSubmissionRepositoryInterface
  extends BaseInterfaceRepository<ContentSubmissionEntity> {
  filterSubmissionsByCustomerId(
    customerId: string,
    queryParams: ContentSubmissionFilterQueryDTO,
  ): Promise<{ result: ContentSubmissionEntity[]; total: number }>;
  findOneByIdWithRelations(
    submissionId: string,
  ): Promise<ContentSubmissionEntity>;
}
