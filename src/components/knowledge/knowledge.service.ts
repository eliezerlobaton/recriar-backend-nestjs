import { Inject } from '@nestjs/common';
import { KnowledgeSubmissionRepositoryInterface } from '../knowledge-submission/interfaces/knowledge-submission.repository.interface';
import { Injectable } from '@nestjs/common';
import { KnowledgeSentDTO } from './dto/knowledge-sent.dto';
import { KnowledgeEntity } from './entities/knowledge.entity';
import { KnowledgeRepositoryInterface } from './interfaces/knowledge.repository.interface';
import { KnowledgeServiceInterface } from './interfaces/knowledge.service.interface';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { itHasNext } from '../shared/lib/common-functions';
import { ScaleDTO } from '../shared/dto/scale.dto';

@Injectable()
export class KnowledgeService implements KnowledgeServiceInterface {
  constructor(
    @Inject('KnowledgeRepositoryInterface')
    private readonly knowledgeRepository: KnowledgeRepositoryInterface,
    @Inject('KnowledgeSubmissionRepositoryInterface')
    private readonly knowledgeSubmissionRepository: KnowledgeSubmissionRepositoryInterface,
  ) {}

  async KnowledgeByCustomerAndObjective(
    customerId: string,
    objectiveId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<KnowledgeSentDTO[]>> {
    const { result, total } =
      await this.knowledgeRepository.getKnowledgeByKnowledgeObjectiveId(
        objectiveId,
        queryParams,
      );

    const { result: submissions } =
      await this.knowledgeSubmissionRepository.filterSubmissionsByCustomerId(
        customerId,
        { KnowledgeId: null, Status: null, ...queryParams },
      );

    const items: KnowledgeSentDTO[] = result.map(
      (knowledge: KnowledgeEntity): KnowledgeSentDTO => {
        const found = submissions.find((submission) => {
          return submission.knowledge.knowledgeid === knowledge.knowledgeid;
        });
        const ret: KnowledgeSentDTO = {
          alreadySent: found !== undefined ? true : false,
          id: knowledge.knowledgeid,
          integrationId: knowledge.integrationid,
          knowledgeType: knowledge.knowledgetype,
          knowledgeObjectives: null,
          description: knowledge.description,
          scale: ScaleDTO.fromEntity(knowledge.scale),
        };
        return ret;
      },
    );
    const { Page = 1, PageSize = 100 } = queryParams;
    const response = {
      hasNext: itHasNext(total, Page, PageSize),
      items: items,
      _messages: '',
    };
    return response;
  }
}
