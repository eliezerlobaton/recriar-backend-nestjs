import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { CreateScheduledAttendanceDto } from '../dto/create-scheduled-attendance.dto';
import { GenerateUrlDto } from '../dto/generate-url.dto';
import { ScheduledAttendanceFilterDto } from '../dto/scheduled-attendance-filter.dto';
import { ScheduledAttendanceWithRoomDto } from '../dto/scheduled-attendance-get-by-id.dto';
import { ScheduledAttendanceQueryParametersDto } from '../dto/scheduled-attendance-query-parameters.dto';
import { ScheduledAttendanceDto } from '../dto/scheduled-attendance.dto';
import { ScheduledAttendancesByDateDto } from '../dto/scheduled-attendances-by-date.dto';

export interface ScheduledAttendanceServiceInterface {
  findAllAndGroupByDate(
    queryParams: ScheduledAttendanceQueryParametersDto,
    filter: ScheduledAttendanceFilterDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendancesByDateDto[]>>;
  findAll(
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>>;
  findOneById(
    id: string,
    identity: string,
  ): Promise<ScheduledAttendanceWithRoomDto>;
  findByCustomerId(
    customerId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>>;
  findBySquadUserId(
    squadUserId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>>;
  finshAttendance(id: string): Promise<ScheduledAttendanceWithRoomDto>;
  noShowAttendance(id: string): Promise<ScheduledAttendanceDto>;
  create(
    CreateScheduledAttendanceDto: CreateScheduledAttendanceDto,
  ): Promise<ScheduledAttendanceDto>;
  createWatcher(): Promise<any>;
  generateAttendaceUrl(generateUrlDto: GenerateUrlDto): Promise<string>;
}
