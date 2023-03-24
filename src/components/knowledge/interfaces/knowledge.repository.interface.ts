import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { KnowledgeEntity } from '../entities/knowledge.entity';

export interface KnowledgeRepositoryInterface
  extends BaseInterfaceRepository<KnowledgeEntity> {
  getKnowledgeByKnowledgeObjectiveId(
    knowledgeObjectiveId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<{ result: KnowledgeEntity[]; total: number }>;
}
