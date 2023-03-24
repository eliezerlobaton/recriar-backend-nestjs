import { KnowledgeObjectiveEntity } from 'src/components/knowledge-objective/entities/knowledge-objective.entity';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { KnowledgeObjectiveFilterQueryDTO } from '../dto/knowledge-objective-filter-query.dto';

export interface KnowledgeObjectiveRepositoryInterface
  extends BaseInterfaceRepository<KnowledgeObjectiveEntity> {
  getByKnowledgeConditionId(
    knowledgeConditionId: string,
    queryParams: KnowledgeObjectiveFilterQueryDTO,
  ): Promise<KnowledgeObjectiveEntity[]>;
}
