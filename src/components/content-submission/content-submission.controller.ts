import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NewContentSubmissionDTO } from './dto/new-content-submission.dto';
import { ContentSubmissionServiceInterface } from './interfaces/content-submission.service.interface';
import { ApiTags } from '@nestjs/swagger';
import { ContentSubmissionDTO } from './dto/content-submission.dto';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { ContentSubmissionFilterQueryDTO } from './dto/content-submission-filter-query.dto';
import { UpdateContentSubmissionDTO } from './dto/update-content-submission.dto';

@ApiTags('ContentSubmission')
@Controller('content-submission')
export class ContentSubmissionController {
  constructor(
    @Inject('ContentSubmissionServiceInterface')
    private readonly contentSubmissionService: ContentSubmissionServiceInterface,
  ) {}

  @Post()
  async NewSubmission(
    @Headers() headers: { authorization: string },
    @Body() newSubmission: NewContentSubmissionDTO,
  ): Promise<ContentSubmissionDTO> {
    if (headers?.authorization) {
      newSubmission.squadUserToken = headers.authorization.split(' ').pop();
    }
    const contentSubmitted =
      await this.contentSubmissionService.NewContentSubmission(newSubmission);
    return contentSubmitted;
  }

  @Get(':customerid')
  async ContentSubmissionsByCustomerId(
    @Param('customerid') id: string,
    @Query() queryParams: ContentSubmissionFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentSubmissionDTO[]>> {
    return await this.contentSubmissionService.GetByCustomer(id, queryParams);
  }

  @Put()
  async updateContentSubmission(
    @Body() updatedContentSubmission: UpdateContentSubmissionDTO,
  ) {
    return this.contentSubmissionService.update(updatedContentSubmission);
  }
}
