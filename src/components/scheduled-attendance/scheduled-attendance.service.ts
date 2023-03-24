import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configService } from 'src/config/config.service';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { CustomerRepositoryInterface } from '../customer/interfaces/customer.repository.interface';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { SquadUserRole } from '../shared/dto/enums/common-enum';
import { SquadUserRepositoryInterface } from '../shared/interfaces/squad-user.repository.interface';
import { TwilioRoomType } from '../video-conference/api/enum/twilio-room-types.enum';
import { RoomDTO } from '../video-conference/dto/room.dto';
import { VideoConferenceApiInterface } from '../video-conference/interfaces/video-conference.api.interface';
import { CreateScheduledAttendanceDto } from './dto/create-scheduled-attendance.dto';
import { GenerateUrlDto } from './dto/generate-url.dto';
import { ScheduledAttendanceFilterDto } from './dto/scheduled-attendance-filter.dto';
import { ScheduledAttendanceWithRoomDto } from './dto/scheduled-attendance-get-by-id.dto';
import { ScheduledAttendanceQueryParametersDto } from './dto/scheduled-attendance-query-parameters.dto';
import { ScheduledAttendanceDto } from './dto/scheduled-attendance.dto';
import { ScheduledAttendancesByDateDto } from './dto/scheduled-attendances-by-date.dto';
import { ScheduledAttendanceStatus } from './enum/scheduled-attendance-status.enum';
import { ScheduledAttendanceRepositoryInterface } from './interfaces/scheduled-attendance.repository.interface';
import { ScheduledAttendanceServiceInterface } from './interfaces/scheduled-attendance.service.interface';
import { CreateEventWatcher } from './use-cases/create-event-watcher.service';
import { UpdateFirebaseAttendanceUseCase } from './use-cases/firebase/update-firebase-attendance.usecase';

@Injectable()
export class ScheduledAttendanceService
  implements ScheduledAttendanceServiceInterface
{
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly scheduledAttendanceRepository: ScheduledAttendanceRepositoryInterface,
    @Inject('VideoConferenceApiService')
    private readonly videoApiService: VideoConferenceApiInterface<TwilioRoomType>,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    private readonly jwtService: JwtService,
    private readonly createEventWatcher: CreateEventWatcher,
    private readonly updateFirebase: UpdateFirebaseAttendanceUseCase,
  ) {}

  private generateCalendarsMap(): Map<SquadUserRole, string> {
    const calendars = new Map<SquadUserRole, string>();
    calendars.set(SquadUserRole.Medic, 'calendario_medico');
    calendars.set(SquadUserRole.HealthCoach, 'calendario_educador_fisico');
    calendars.set(SquadUserRole.Nurse, 'calendario_enfermeira');
    calendars.set(SquadUserRole.Nutritionist, 'calendario_nutricao');
    calendars.set(SquadUserRole.Psychologist, 'calendario_psico');
    return calendars;
  }

  private formatCellphone(cellphone: string): string {
    cellphone = cellphone.replace(/[^0-9]/gi, '');
    return !cellphone.includes('+') ? `+55${cellphone}` : `${cellphone}`;
  }

  private getCustomerCellphone(customer: CustomerEntity): string {
    if (!customer.cellphone && customer.telephone)
      return this.formatCellphone(customer.telephone);
    if (customer.cellphone) return this.formatCellphone(customer.cellphone);
    return '';
  }

  async generateAttendaceUrl(generateUrlDto: GenerateUrlDto): Promise<string> {
    const calendars = this.generateCalendarsMap();
    const customer = await this.customerRepository.findOneById(
      generateUrlDto.customerId,
    );

    const squadUser = await this.squadUserRepository.findOneById(
      generateUrlDto.squadUserId,
    );

    const params = `${calendars.get(SquadUserRole[squadUser.role])}?name=${
      customer.name
    }&email=${customer.email}&phone_number=${this.getCustomerCellphone(
      customer,
    )}`;
    return `${configService.calendly.getUrl()}/${params}`;
  }

  async createWatcher(): Promise<any> {
    const url = configService.getLokiUrl().split('/').slice(0, -3).join('/');
    return await this.createEventWatcher.run(
      `${url}/backend-nest/scheduled-attendance/watcher/event`,
    );
  }

  async create(
    createScheduledAttendanceDto: CreateScheduledAttendanceDto,
  ): Promise<ScheduledAttendanceDto> {
    let entity;
    try {
      entity = await this.scheduledAttendanceRepository.create(
        CreateScheduledAttendanceDto.fromDto(createScheduledAttendanceDto),
      );
    } catch (error) {
      Logger.error(error);
    }

    return ScheduledAttendanceDto.fromEntity(entity);
  }

  async finshAttendance(id: string): Promise<ScheduledAttendanceWithRoomDto> {
    const attendance =
      await this.scheduledAttendanceRepository.findOneByIdWithRelations(id);
    const room = await this.videoApiService.completeRoom(
      attendance.attendance_url,
    );
    attendance.status = ScheduledAttendanceStatus.Realized;
    const updated = await this.scheduledAttendanceRepository.updateOne(
      attendance,
    );
    return Object.assign(
      { room },
      ScheduledAttendanceWithRoomDto.fromEntity(updated),
    );
  }

  async noShowAttendance(id: string): Promise<ScheduledAttendanceDto> {
    const attendance =
      await this.scheduledAttendanceRepository.findOneByIdWithRelations(id);
    if (attendance.attendance_url) {
      try {
        await this.videoApiService.completeRoom(attendance.attendance_url);
      } catch (error) {
        Logger.error(error);
        console.log(error);
      }
    }
    attendance.status = ScheduledAttendanceStatus.NoShow;
    const updated = await this.scheduledAttendanceRepository.updateOne(
      attendance,
    );
    const schedule =
      await this.scheduledAttendanceRepository.findOneByIdWithRelations(id);
    await this.updateFirebase.execute(
      schedule.squaduser.squaduserid,
      schedule.scheduled_attendanceid,
      'status',
      ScheduledAttendanceStatus.NoShow,
    );
    return ScheduledAttendanceDto.fromEntity(schedule);
  }

  async findByCustomerId(
    customerId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    const {
      _messages,
      hasNext,
      items: attendances,
    } = await this.scheduledAttendanceRepository.findByCustomerId(
      customerId,
      queryParams,
    );
    return {
      _messages,
      hasNext,
      items: attendances.map((attendance) =>
        ScheduledAttendanceDto.fromEntity(attendance),
      ),
    };
  }

  async findBySquadUserId(
    squadUserId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    const {
      _messages,
      hasNext,
      items: attendances,
    } = await this.scheduledAttendanceRepository.findBySquadUserId(
      squadUserId,
      queryParams,
    );
    return {
      _messages,
      hasNext,
      items: attendances.map((attendance) =>
        ScheduledAttendanceDto.fromEntity(attendance),
      ),
    };
  }

  async findOneById(
    id: string,
    identity: string,
  ): Promise<ScheduledAttendanceWithRoomDto> {
    let room;
    const attendance =
      await this.scheduledAttendanceRepository.findOneByIdWithRelations(id);

    try {
      room = attendance?.attendance_url
        ? await this.videoApiService.getOneRoom(attendance.attendance_url)
        : new RoomDTO();
    } catch (error) {
      Logger.error(error);
    }

    const dto = ScheduledAttendanceWithRoomDto.fromEntityAndRoomInstance(
      attendance,
      room,
    );

    identity = identity
      ? (<any>this.jwtService.decode(identity)).user_id
      : dto.customer.id;

    dto.token = room.name
      ? this.videoApiService.generateAuthToken(dto.room.name, identity).token
      : null;
    return dto;
  }

  async findAll(
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    const { _messages, hasNext, items } =
      await this.scheduledAttendanceRepository.findAllWithRelations(
        queryParams,
        {},
      );

    return {
      _messages,
      hasNext,
      items: items.map((item) => ScheduledAttendanceDto.fromEntity(item)),
    };
  }

  private formatDateToAgroup(date: Date): string {
    return date
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        weekday: 'long',
      })
      .replace(' ', '')
      .split(',')
      .reverse()
      .join(' - ');
  }

  async findAllAndGroupByDate(
    queryParams: ScheduledAttendanceQueryParametersDto,
    filter: ScheduledAttendanceFilterDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendancesByDateDto[]>> {
    const { _messages, hasNext, items } =
      await this.scheduledAttendanceRepository.findAllWithRelations(
        queryParams,
        filter,
      );

    const attencesByDate = items.reduce((attendances, attendance) => {
      const date = this.formatDateToAgroup(new Date(attendance.start_date));

      if (!(date in attendances))
        attendances[date] = {
          date: date,
          attendances: [],
        };

      attendances[date].attendances.push(
        ScheduledAttendanceDto.fromEntity(attendance),
      );

      return attendances;
    }, {});

    return {
      _messages,
      hasNext,
      items: Object.values(attencesByDate),
    };
  }
}
