import { Inject } from '@nestjs/common';
import { ScheduledAttendanceDto } from 'src/components/scheduled-attendance/dto/scheduled-attendance.dto';
import { ScheduledAttendanceEntity } from 'src/components/scheduled-attendance/entities/scheduled-attendance.entity';
import { ScheduledAttendanceRepositoryInterface } from 'src/components/scheduled-attendance/interfaces/scheduled-attendance.repository.interface';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { itHasNext } from 'src/components/shared/lib/common-functions';
import { FindConditions, FindManyOptions } from 'typeorm';
import { AttendanceMapper } from '../mappers/attendance.mapper';

export class GetAllAttendancesUseCase
  implements UseCase<GetBaseResponseDTO<ScheduledAttendanceDto[]>>
{
  private readonly mapper = new AttendanceMapper();
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly attendanceRepository: ScheduledAttendanceRepositoryInterface,
  ) {}

  async execute(
    queryParams: BaseQueryParametersDTO,
    customerId?: string,
    squadUserId?: string,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceDto[]>> {
    const options: FindManyOptions<ScheduledAttendanceEntity> = {};
    const where: FindConditions<ScheduledAttendanceEntity> = {};
    const results: GetBaseResponseDTO<ScheduledAttendanceDto[]> = {
      items: [],
      hasNext: false,
      _messages: null,
    };
    const hasPagination = queryParams?.Page && queryParams?.PageSize;

    if (customerId) {
      where.customer = <any>customerId;
    }

    if (squadUserId) {
      where.squaduser = <any>squadUserId;
    }

    if (where.customer || where.squaduser) options.where = where;

    if (hasPagination) {
      const { skip, take } = this.attendanceRepository.pagination(
        queryParams.Page,
        queryParams.PageSize,
      );
      options.skip = skip;
      options.take = take;
    }

    const [attendances, total] = await this.attendanceRepository.findAndCount(
      options,
    );

    results.hasNext = hasPagination
      ? itHasNext(total, queryParams.Page, queryParams.PageSize)
      : false;

    results.items = attendances.map((note) => this.mapper.mapFrom(note));
    return results;
  }
}
