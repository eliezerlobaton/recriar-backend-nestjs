import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Headers,
  Query,
} from '@nestjs/common';
import { NewKnowledgeSubmissionDTO } from './dto/new-knowledge-submission.dto';
import { KnowledgeSubmissionServiceInterface } from './interfaces/knowledge-submission.service.interface';
import { ApiTags } from '@nestjs/swagger';
import { KnowledgeSubmissionDTO } from './dto/knowledge-submission.dto';
import { UpdatedKnowledgeSubmission } from './dto/update-knowledge-submission.dto';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { KnowledgeFilterQueryDTO } from '../shared/dto/knowledge-filter-query.dto';
import { ResendKnowledgeSubmissionDTO } from './dto/resend-knowledge-submission.dto';

@ApiTags('KnowledgeSubmission')
@Controller('knowledge-submission')
export class KnowledgeSubmissionController {
  constructor(
    @Inject('KnowledgeSubmissionServiceInterface')
    private readonly knowledgeSubmissionService: KnowledgeSubmissionServiceInterface,
  ) {}

  @Get(':customerid')
  async FilterCustomerSubmissions(
    @Param('customerid') id: string,
    @Query() queryParams: KnowledgeFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<KnowledgeSubmissionDTO[]>> {
    const { result, hasNext } =
      await this.knowledgeSubmissionService.filterByCustomerId(id, queryParams);

    return {
      hasNext: hasNext,
      items: result.map((submission) => {
        delete submission.scale;
        return submission;
      }),
      _messages: '',
    };
  }

  @Post()
  async CreateSubmission(
    @Headers() headers: { authorization: string },
    @Body() newSubmission: NewKnowledgeSubmissionDTO,
  ): Promise<KnowledgeSubmissionDTO> {
    if (headers?.authorization) {
      newSubmission.squadUserToken = headers.authorization.split(' ').pop();
    }
    return this.knowledgeSubmissionService.create(newSubmission);
  }

  @Put()
  async UpdateSubmission(
    @Body() updatedSubmission: UpdatedKnowledgeSubmission,
  ): Promise<KnowledgeSubmissionDTO> {
    return this.knowledgeSubmissionService.update(updatedSubmission);
  }

  @Post('resend')
  async ResendKnowledgeSubmission(
    @Headers() headers: { authorization: string },
    @Body() resendSubmission: ResendKnowledgeSubmissionDTO,
  ): Promise<KnowledgeSubmissionDTO> {
    if (headers?.authorization) {
      resendSubmission.squadUserToken = headers.authorization.split(' ').pop();
    }
    return this.knowledgeSubmissionService.resend(resendSubmission);
  }
}
