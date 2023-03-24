import { KnowledgeFilterQueryDTO } from 'src/components/shared/dto/knowledge-filter-query.dto';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { KnowledgeSubmissionEntity } from '../entities/knowledge-submission.entity';

export interface KnowledgeSubmissionRepositoryInterface
  extends BaseInterfaceRepository<KnowledgeSubmissionEntity> {
  filterSubmissionsByCustomerId(
    customerId: string,
    queryParams: KnowledgeFilterQueryDTO,
  ): Promise<{ result: KnowledgeSubmissionEntity[]; hasNext: boolean }>;
  findOneByIdWithRelations(
    submissionId: string,
  ): Promise<KnowledgeSubmissionEntity>;
}
