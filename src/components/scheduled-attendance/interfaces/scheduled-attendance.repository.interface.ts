import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { ScheduledAttendanceFilterDto } from '../dto/scheduled-attendance-filter.dto';
import { ScheduledAttendanceQueryParametersDto } from '../dto/scheduled-attendance-query-parameters.dto';
import { ScheduledAttendanceEntity } from '../entities/scheduled-attendance.entity';

export interface ScheduledAttendanceRepositoryInterface
  extends BaseInterfaceRepository<ScheduledAttendanceEntity> {
  findAllWithRelations(
    queryParams: BaseQueryParametersDTO,
    filter: ScheduledAttendanceFilterDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceEntity[]>>;
  findOneByIdWithRelations(id: string): Promise<ScheduledAttendanceEntity>;
  findByCustomerId(
    customerId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceEntity[]>>;
  findBySquadUserId(
    squadUserId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceEntity[]>>;
}
