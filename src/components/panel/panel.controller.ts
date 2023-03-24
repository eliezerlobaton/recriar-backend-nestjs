import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { ResponsibleTasksDTO } from './dto/responsible-tasks.dto';
import { PanelService } from './panel.service';
import { GetAllCustomerResponsibleUseCase } from './use-cases/get-all-customer-responsible.usecase';

@ApiTags('Panel')
@Controller('panel')
export class PanelController {
  constructor(
    @Inject('PanelServiceInterface')
    private readonly panelService: PanelService,
    private readonly getAllCustomerResponsibleUseCase: GetAllCustomerResponsibleUseCase,
  ) {}

  @Get('/pending-tasks/responsible/:responsibleid')
  async getAllTasksByResponsible(
    @Param('responsibleid', new ParseUUIDPipe()) id: string,
  ): Promise<ResponsibleTasksDTO[]> {
    return await this.panelService.getAllTasksByResponsible(id);
  }

  @Get('/pending-tasks/assistant/:assistantid')
  async getPendingTasksByAssistant(
    @Param('assistantid', new ParseUUIDPipe()) id: string,
  ) {
    return await this.panelService.getPendingTasksByAssistant(id);
  }

  @Get('/responsible/:responsibleid')
  async getAllCustomerResponsible(
    @Param('responsibleid') squadUserId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ) {
    return this.getAllCustomerResponsibleUseCase.execute(queryParams, {
      squadUserId,
    });
  }
}
