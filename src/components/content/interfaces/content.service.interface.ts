import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { ContentFilterQueryDTO } from '../dto/content-filter-query.dto';
import { ContentSentDTO } from '../dto/content-sent.dto';
import { ContentDTO } from '../dto/content.dto';

export interface ContentServiceInterface {
  GetAll(
    queryParams: ContentFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentDTO[]>>;

  FilterSentByCustomerAndKnowledge(
    customerid: string,
    queryParams: ContentFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentSentDTO[]>>;

  FindByContentId(contentId: string): Promise<ContentDTO>;

  FilterByKnowledgeObjective(
    knowledgeObjectiveId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<ContentDTO[]>>;
}
