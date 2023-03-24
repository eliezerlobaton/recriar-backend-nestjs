import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KnowledgeObjectiveDTO } from './dto/knowledge-objective.dto';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { KnowledgeObjectiveFilterQueryDTO } from './dto/knowledge-objective-filter-query.dto';
import { KnowledgeObjectiveServiceInterface } from './interfaces/knowledge-objective.interface';

@ApiTags('KnowledgeObjective')
@Controller('knowledge-objective')
export class KnowledgeObjectiveController {
  constructor(
    @Inject('KnowledgeObjectiveServiceInterface')
    private readonly knowledgeObjectiveService: KnowledgeObjectiveServiceInterface,
  ) {}

  @Get(':customerid')
  async CustomerObjectives(
    @Param('customerid') customerId: string,
    @Query() queryParams: KnowledgeObjectiveFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<KnowledgeObjectiveDTO[]>> {
    try {
      const { objectives, hasNext } =
        await this.knowledgeObjectiveService.CustomerObjectives(
          customerId,
          queryParams,
        );

      return {
        hasNext: hasNext,
        items: objectives,
        _messages: null,
      };
    } catch (e) {
      return {
        hasNext: false,
        items: [],
        _messages: [
          {
            code: 'ERROR',
            type: 'error',
            message: e.message,
          },
        ],
      };
    }
  }
}
