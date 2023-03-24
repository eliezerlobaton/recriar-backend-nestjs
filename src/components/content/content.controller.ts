import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ApiTags } from '@nestjs/swagger';
import { ContentDTO } from './dto/content.dto';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { ContentSentDTO } from './dto/content-sent.dto';
import { ContentFilterQueryDTO } from './dto/content-filter-query.dto';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(
    @Inject('ContentServiceInterface')
    private readonly contentService: ContentServiceInterface,
  ) {}

  @Get('/customer/:customerid')
  async FilterByCustomerAndKnowledge(
    @Param('customerid') customerId: string,
    @Query() queryParams: ContentFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentSentDTO[]>> {
    return await this.contentService.FilterSentByCustomerAndKnowledge(
      customerId,
      queryParams,
    );
  }

  @Get()
  async GetAll(
    @Query() queryParams: ContentFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentDTO[]>> {
    return await this.contentService.GetAll(queryParams);
  }

  @Get('knowledge-objective/:knowledgeObjectiveId')
  async FilterByKnowledgeObjective(
    @Param('knowledgeObjectiveId') id: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<ContentDTO[]>> {
    return await this.contentService.FilterByKnowledgeObjective(
      id,
      queryParams,
    );
  }

  @Get(':contentid')
  async FindByContentId(@Param('contentid') id: string): Promise<ContentDTO> {
    return await this.contentService.FindByContentId(id);
  }
}
