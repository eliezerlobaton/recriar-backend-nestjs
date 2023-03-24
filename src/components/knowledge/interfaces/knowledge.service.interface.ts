import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { KnowledgeSentDTO } from '../dto/knowledge-sent.dto';

export interface KnowledgeServiceInterface {
  KnowledgeByCustomerAndObjective(
    customerId: string,
    objectiveId: string,
    queryParams?: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<KnowledgeSentDTO[]>>;
}
