import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseService } from 'src/firebase/firebase.service';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { extractBearerToken } from '../shared/lib/common-functions';
import { StatusCallbackBodyDto } from '../video-conference/dto/status-callback-body.dto';
import { CreateScheduledAttendanceDto } from './dto/create-scheduled-attendance.dto';
import { DeleteWatcherDto } from './dto/delete-watcher.dto';
import { GenerateUrlDto } from './dto/generate-url.dto';
import { ScheduledAttendanceFindAllDto } from './dto/scheduled-attendance-find-all.dto';
import { ScheduledAttendanceQueryParametersDto } from './dto/scheduled-attendance-query-parameters.dto';
import { ScheduledAttendanceStatus } from './enum/scheduled-attendance-status.enum';
import { FirebaseStatusSynchronizerInterceptor } from './interceptors/firebase-status-synchronizer.interceptor';
import { ScheduledAttendanceServiceInterface } from './interfaces/scheduled-attendance.service.interface';
import { CreateMockAttendancesService } from './use-cases/create-mock-attendances.service';
import { DeleteEventWatcherUseCase } from './use-cases/delete-watcher.usecase';
import { HandleCalendarWebhookUseCase } from './use-cases/handle-calendar-webhook.usecase';
import { HandleRoomUpdates } from './use-cases/handle-room-updates.service';
import { RenewEventWatcherUseCase } from './use-cases/renew-event-watcher.usecase';
import { UpdateAttendancesStatusUseCase } from './use-cases/update-attendance-status.usecase';

@ApiTags('ScheduledAttendance')
@Controller('scheduled-attendance')
export class ScheduledAttendanceController {
  constructor(
    @Inject('ScheduledAttendanceServiceInterface')
    private readonly scheduledAttendanceService: ScheduledAttendanceServiceInterface,
    private readonly createMockAttendances: CreateMockAttendancesService,
    private readonly firebase: FirebaseService,
    private readonly handleRoom: HandleRoomUpdates,
    private readonly updateStatus: UpdateAttendancesStatusUseCase,
    private readonly deleteEventWatcher: DeleteEventWatcherUseCase,
    private readonly createEventWatcher: RenewEventWatcherUseCase,
    private readonly calendarHandler: HandleCalendarWebhookUseCase,
  ) {
    this.updateStatus.execute();
  }

  @Post('/room/status-callback')
  async registerRoomUpdates(@Body() body: StatusCallbackBodyDto) {
    return await this.handleRoom.run(body);
  }

  @Get('/firebase/database')
  async getAllRegisters() {
    return (await this.firebase.dataBase.ref('attendances').get()).val();
  }

  @Post('/watcher')
  async createWatcher() {
    return this.createEventWatcher.execute();
  }

  @Delete('/watcher')
  async deleteWatcher(@Body() deleteWatcherDto: DeleteWatcherDto) {
    return this.deleteEventWatcher.execute(deleteWatcherDto);
  }

  @Post('/watcher/event')
  async registerEventUpdate(@Headers('x-goog-channel-token') token: string) {
    return await this.calendarHandler.execute(token);
  }

  @Post()
  async create(@Body() createDto: CreateScheduledAttendanceDto) {
    return await this.scheduledAttendanceService.create(createDto);
  }

  @Post('/url')
  async generateUrl(@Body() generateUrl: GenerateUrlDto) {
    const url = await this.scheduledAttendanceService.generateAttendaceUrl(
      generateUrl,
    );
    return { url };
  }

  @Get('/:id')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getOneById(
    @Headers() headers: { authorization: string },
    @Param('id') id: string,
  ) {
    return await this.scheduledAttendanceService.findOneById(
      id,
      extractBearerToken(headers),
    );
  }

  @Post('/:id/finish')
  async finishAttendance(@Param('id') id: string) {
    return await this.scheduledAttendanceService.finshAttendance(id);
  }

  @Post('/:id/noshow')
  async noShowAttendance(@Param('id') id: string) {
    return await this.scheduledAttendanceService.noShowAttendance(id);
  }

  @Get()
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAll(@Query() queryParams: ScheduledAttendanceFindAllDto) {
    const result = await this.scheduledAttendanceService.findAllAndGroupByDate(
      queryParams,
      {
        CustomerId: queryParams?.CustomerId,
        SquadUserId: queryParams?.SquadUserId,
      },
    );
    return result;
  }

  @Get('/squaduser/:squaduserid')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAllBySquadUser(
    @Param('squaduserid') squadUserId: string,
    @Query() queryParams: ScheduledAttendanceQueryParametersDto,
  ) {
    return await this.scheduledAttendanceService.findBySquadUserId(
      squadUserId,
      queryParams,
    );
  }

  @Get('/customer/:customerid')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAllByCustomer(
    @Param('customerid') customerId: string,
    @Query() queryParams: ScheduledAttendanceQueryParametersDto,
  ) {
    return await this.scheduledAttendanceService.findByCustomerId(
      customerId,
      queryParams,
    );
  }

  @Get('/customer/:customerid/active')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAllActiveByCustomer(
    @Param('customerid') customerId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ) {
    return await this.scheduledAttendanceService.findByCustomerId(
      customerId,
      Object.assign({ Status: ScheduledAttendanceStatus.Active }, queryParams),
    );
  }

  @Get('/customer/:customerid/inactive')
  @UseInterceptors(FirebaseStatusSynchronizerInterceptor)
  async getAllInactiveByCustomer(
    @Param('customerid') customerId: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ) {
    return await this.scheduledAttendanceService.findByCustomerId(
      customerId,
      Object.assign(
        { Status: ScheduledAttendanceStatus.Realized },
        queryParams,
      ),
    );
  }

  @Post('/fake')
  async createFakeRegisters(
    @Body()
    body: {
      ids?: { squadUserId?: string; customerId?: string };
      limit: number;
    },
  ) {
    return await this.createMockAttendances.run(body.limit, body?.ids);
  }
}
