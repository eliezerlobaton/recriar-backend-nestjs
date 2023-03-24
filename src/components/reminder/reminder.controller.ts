import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { DeleteReminderDto } from './dto/delete-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { CreateReminderUseCase } from './use-cases/create-reminder.usecase';
import { DeleteReminderUseCase } from './use-cases/delete-reminder.usecase';
import { GetAllRemindersUseCase } from './use-cases/get-all-reminders.usecase';
import { GetOneReminderUseCase } from './use-cases/get-one-reminder.usecase';
import { UpdateReminderUseCase } from './use-cases/update-reminder.usecase';

@ApiTags('Reminder')
@Controller('reminder')
export class ReminderController {
  constructor(
    private readonly createReminderUseCase: CreateReminderUseCase,
    private readonly getAllRemindersUseCase: GetAllRemindersUseCase,
    private readonly getOneReminderUseCase: GetOneReminderUseCase,
    private readonly updateReminderUseCase: UpdateReminderUseCase,
    private readonly deleteReminderUseCase: DeleteReminderUseCase,
  ) {}

  @Post()
  async create(@Body() createReminderDto: CreateReminderDto) {
    return this.createReminderUseCase.execute(createReminderDto);
  }

  @Get()
  async findAll(@Query() queryParams: BaseQueryParametersDTO) {
    return this.getAllRemindersUseCase.execute(queryParams, {});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getOneReminderUseCase.execute(id);
  }

  @Put()
  async update(@Body() updateReminderDto: UpdateReminderDto) {
    return this.updateReminderUseCase.execute(updateReminderDto);
  }

  @Delete()
  async remove(@Body() deleteReminderDto: DeleteReminderDto) {
    return this.deleteReminderUseCase.execute(deleteReminderDto);
  }
}
