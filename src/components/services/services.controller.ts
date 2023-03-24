import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssistantRequestDTO } from '../assistant-request/dto/assistant-request.dto';
import { ScheduledAttendanceDto } from '../scheduled-attendance/dto/scheduled-attendance.dto';
import { FirebaseStatusSynchronizerInterceptor } from '../scheduled-attendance/interceptors/firebase-status-synchronizer.interceptor';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { DeleteNoteDto } from './dto/delete-note.dto';
import { NoteDto } from './dto/note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteUseCase } from './use-cases/create-note.usecase';
import { DeleteOneNoteUseCase } from './use-cases/delete-one-note.usecase';
import { GetAllAttendancesUseCase } from './use-cases/get-all-attendances.usecase';
import { GetAllForwardingsUseCase } from './use-cases/get-all-forwardings.usecase';
import { GetAllNotesUseCase } from './use-cases/get-all-notes.usecase';
import { GetOneNoteUseCase } from './use-cases/get-one-note.usecase';
import { UpdateOneNoteUseCase } from './use-cases/update-one-note.usecase';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly getAllNotesUseCase: GetAllNotesUseCase,
    private readonly getOneNoteUseCase: GetOneNoteUseCase,
    private readonly updateOneNoteUseCase: UpdateOneNoteUseCase,
    private readonly deleteOneNoteUseCase: DeleteOneNoteUseCase,
    private readonly getAllAttendancesUseCase: GetAllAttendancesUseCase,
    private readonly getAllForwardingsUseCase: GetAllForwardingsUseCase,
  ) {}

  @Post('/notes')
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<NoteDto> {
    return this.createNoteUseCase.execute(createNoteDto);
  }

  @Get('/notes')
  async getAllNotes(
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<NoteDto[]>> {
    return this.getAllNotesUseCase.execute(queryParams);
  }

  @Get('/notes/:id')
  async getOneNote(@Param('id') id: string): Promise<NoteDto> {
    return this.getOneNoteUseCase.execute(id);
  }

  @Put('/notes')
  async updateOne(@Body() updatedNoteDto: UpdateNoteDto): Promise<NoteDto> {
    return this.updateOneNoteUseCase.execute(updatedNoteDto);
  }

  @Delete('/notes')
  async deleteOne(@Body() deleteNoteDto: DeleteNoteDto) {
    return this.deleteOneNoteUseCase.execute(deleteNoteDto);
  }

  @Get('/notes/customer/:customer')
  async getNotesByCustomer(
    @Param('customer') customerId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<NoteDto[]>> {
    return this.getAllNotesUseCase.execute(queryParams, customerId);
  }

  @Get('/notes/customer/:customer/:squad')
  async getNotesByCustomerAndSquadUser(
    @Param('customer') customerId: string,
    @Param('squad') squadUserId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<NoteDto[]>> {
    return this.getAllNotesUseCase.execute(
      queryParams,
      customerId,
      squadUserId,
    );
  }

  @Get('/attendances')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAllAttendances(
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    return this.getAllAttendancesUseCase.execute(queryParams);
  }

  @Get('/attendances/customer/:customer')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAttendancesByCustomer(
    @Param('customer') customerId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    return this.getAllAttendancesUseCase.execute(queryParams, customerId);
  }

  @Get('/attendances/customer/:customer/:squad')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAttendancesByCustomerAndSquadUser(
    @Param('customer') customerId: string,
    @Param('squad') squadUserId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    return this.getAllAttendancesUseCase.execute(
      queryParams,
      customerId,
      squadUserId,
    );
  }

  @Get('/forwardings')
  async getAllForwardings(
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<AssistantRequestDTO[]>> {
    return this.getAllForwardingsUseCase.execute(queryParams);
  }

  @Get('/forwardings/customer/:customer')
  async getForwardingsByCustomer(
    @Param('customer') customerId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<AssistantRequestDTO[]>> {
    return this.getAllForwardingsUseCase.execute(queryParams, customerId);
  }

  @Get('/forwardings/customer/:customer/:squaduser')
  async getForwardingsByCustomerAndSquadUser(
    @Param('customer') customerId: string,
    @Param('squaduser') squadUserId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<AssistantRequestDTO[]>> {
    return this.getAllForwardingsUseCase.execute(
      queryParams,
      customerId,
      squadUserId,
    );
  }
}
