import { KnowledgeObjectiveDTO } from 'src/components/knowledge-objective/dto/knowledge-objective.dto';
import { KnowledgeObjectiveFilterQueryDTO } from '../dto/knowledge-objective-filter-query.dto';

export interface KnowledgeObjectiveServiceInterface {
  CustomerObjectives(
    customerId: string,
    queryParams: KnowledgeObjectiveFilterQueryDTO,
  ): Promise<{ objectives: KnowledgeObjectiveDTO[]; hasNext: boolean }>;
}
