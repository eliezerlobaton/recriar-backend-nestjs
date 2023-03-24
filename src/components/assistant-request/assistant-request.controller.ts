import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssistantRequestService as AssistantRequestServiceInterface } from './assistant-request.service';
import { CreateAssistantRequestDto } from './dto/create-assistant-request.dto';
import { FinishAssistanceDTO } from './dto/finish-assistance.dto';

@ApiTags('AssistantRequest')
@Controller('assistant-request')
export class AssistantRequestController {
  constructor(
    @Inject('AssistantRequestServiceInterface')
    private readonly assistantRequestServiceInterface: AssistantRequestServiceInterface,
  ) {}

  @Post()
  async create(
    @Headers() headers: { authorization: string },
    @Body() createAssistantRequestDto: CreateAssistantRequestDto,
  ) {
    if (headers?.authorization) {
      createAssistantRequestDto.sentBy = headers.authorization.split(' ').pop();
    }
    return await this.assistantRequestServiceInterface.create(
      createAssistantRequestDto,
    );
  }

  @Get()
  async findAll() {
    return await this.assistantRequestServiceInterface.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.assistantRequestServiceInterface.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.assistantRequestServiceInterface.delete(id);
  }

  @Post('/finish-assistance')
  async finishAssistance(
    @Headers() headers: { authorization: string },
    @Body() finishAssistance: FinishAssistanceDTO,
  ) {
    if (headers?.authorization) {
      finishAssistance.sentBy = headers.authorization.split(' ').pop();
    }
    return await this.assistantRequestServiceInterface.finishAssistance(
      finishAssistance,
    );
  }

  @Get('/assistant/:assistantid')
  async filterRequestByAssistant(@Param('assistantid') id: string) {
    return await this.assistantRequestServiceInterface.filterActiveRequestByAssistant(
      id,
    );
  }
}
