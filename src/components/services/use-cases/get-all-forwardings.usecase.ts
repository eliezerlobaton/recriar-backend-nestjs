import { Inject, Injectable } from '@nestjs/common';
import { AssistantRequestDTO } from 'src/components/assistant-request/dto/assistant-request.dto';
import { AssistantRequestEntity } from 'src/components/assistant-request/entities/assistant-request.entity';
import { AssistantRequestRepositoryInterface } from 'src/components/assistant-request/interfaces/assistant-request.repository.interface';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { itHasNext } from 'src/components/shared/lib/common-functions';
import { FindConditions, FindManyOptions } from 'typeorm';
import { ForwardMapper } from '../mappers/forward.mapper';

@Injectable()
export class GetAllForwardingsUseCase
  implements UseCase<GetBaseResponseDTO<AssistantRequestDTO[]>>
{
  private readonly mapper = new ForwardMapper();
  constructor(
    @Inject('AssistantRequestRepositoryInterface')
    private readonly forwardRepository: AssistantRequestRepositoryInterface,
  ) {}

  async execute(
    queryParams: BaseQueryParametersDTO,
    customerId?: string,
    squadUserId?: string,
  ): Promise<GetBaseResponseDTO<AssistantRequestDTO[]>> {
    const options: FindManyOptions<AssistantRequestEntity> = {};
    const where: FindConditions<AssistantRequestEntity> = {};
    const results: GetBaseResponseDTO<AssistantRequestDTO[]> = {
      items: [],
      hasNext: false,
      _messages: null,
    };
    const hasPagination = queryParams?.Page && queryParams?.PageSize;

    if (customerId) {
      where.customer = <any>customerId;
    }

    if (squadUserId) {
      where.responsible = <any>squadUserId;
    }

    if (where.customer || where.responsible) options.where = where;

    if (hasPagination) {
      const { skip, take } = this.forwardRepository.pagination(
        queryParams.Page,
        queryParams.PageSize,
      );
      options.skip = skip;
      options.take = take;
    }

    const [forwardings, total] = await this.forwardRepository.findAndCount(
      options,
    );

    results.hasNext = hasPagination
      ? itHasNext(total, queryParams.Page, queryParams.PageSize)
      : false;

    results.items = forwardings.map((note) => this.mapper.mapFrom(note));

    return results;
  }
}
