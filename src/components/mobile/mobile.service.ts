import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeSubmissionServiceInterface } from '../knowledge-submission/interfaces/knowledge-submission.service.interface';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { IndicatorDTO } from './dto/indicator.dto';
import { MobileServiceInterface } from './interfaces/mobile.service.interface';

@Injectable()
export class MobileService implements MobileServiceInterface {
  constructor(
    @Inject('KnowledgeSubmissionServiceInterface')
    private readonly submissionService: KnowledgeSubmissionServiceInterface,
  ) {}

  async findIndicatorsByCustomer(
    customerId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<IndicatorDTO[]>> {
    const { result, hasNext } = await this.submissionService.filterByCustomerId(
      customerId,
      {
        KnowledgeId: undefined,
        Status: undefined,
        ...queryParams,
      },
    );

    const items = result.map((knowledge) =>
      IndicatorDTO.fromKnowldege(knowledge),
    );

    return {
      hasNext: hasNext,
      items: [...items],
      _messages: null,
    };
  }
}
