import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { KnowledgeServiceInterface } from './interfaces/knowledge.service.interface';
import { ApiTags } from '@nestjs/swagger';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { KnowledgeSentDTO } from './dto/knowledge-sent.dto';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';

@ApiTags('Knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(
    @Inject('KnowledgeServiceInterface')
    private readonly knowledgeService: KnowledgeServiceInterface,
  ) {}

  @Get()
  async knowledge() {
    return { text: 'hello knowldege' };
  }

  @Get(':customerid/:objectiveid')
  async Knowledge(
    @Param('customerid') customerId: string,
    @Param('objectiveid') objectiveId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<KnowledgeSentDTO[]>> {
    return await this.knowledgeService.KnowledgeByCustomerAndObjective(
      customerId,
      objectiveId,
      queryParams,
    );
  }
}
