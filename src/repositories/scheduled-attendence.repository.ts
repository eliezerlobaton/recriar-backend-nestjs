import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduledAttendanceFilterDto } from 'src/components/scheduled-attendance/dto/scheduled-attendance-filter.dto';
import { ScheduledAttendanceQueryParametersDto } from 'src/components/scheduled-attendance/dto/scheduled-attendance-query-parameters.dto';
import { ScheduledAttendanceEntity } from 'src/components/scheduled-attendance/entities/scheduled-attendance.entity';
import { ScheduledAttendanceRepositoryInterface } from 'src/components/scheduled-attendance/interfaces/scheduled-attendance.repository.interface';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { itHasNext } from 'src/components/shared/lib/common-functions';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class ScheduledAttendanceRepository
  extends BaseAbstractRepository<ScheduledAttendanceEntity>
  implements ScheduledAttendanceRepositoryInterface
{
  constructor(
    @InjectRepository(ScheduledAttendanceEntity)
    private readonly guidanceRepository: Repository<ScheduledAttendanceEntity>,
  ) {
    super(guidanceRepository);
  }

  async findByCustomerId(
    customerId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceEntity[]>> {
    return await this.findAllWithRelations(queryParams, {
      CustomerId: customerId,
    });
  }

  async findBySquadUserId(
    squadUserId: string,
    queryParams: ScheduledAttendanceQueryParametersDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceEntity[]>> {
    return await this.findAllWithRelations(queryParams, {
      SquadUserId: squadUserId,
    });
  }

  async findOneByIdWithRelations(
    id: string,
  ): Promise<ScheduledAttendanceEntity> {
    const query = this.guidanceRepository.createQueryBuilder('attendance');
    query.where('attendance.scheduled_attendanceid = :id', { id: id });
    query.innerJoinAndSelect('attendance.customer', 'customer');
    query.innerJoinAndSelect('attendance.squaduser', 'squaduser');
    return await query.getOne();
  }

  async findAllWithRelations(
    queryParams: ScheduledAttendanceQueryParametersDto,
    filter: ScheduledAttendanceFilterDto,
  ): Promise<GetBaseResponseDTO<ScheduledAttendanceEntity[]>> {
    const result: GetBaseResponseDTO<ScheduledAttendanceEntity[]> = {
      _messages: null,
      hasNext: false,
      items: [],
    };

    try {
      const query = this.guidanceRepository.createQueryBuilder('attendance');

      if (queryParams?.Status) {
        query.where('attendance.status = :status', {
          status: queryParams.Status,
        });
      }

      if (filter?.CustomerId) {
        query.innerJoinAndSelect(
          'attendance.customer',
          'customer',
          'attendance.customer = :customer',
          { customer: filter.CustomerId },
        );
      } else query.innerJoinAndSelect('attendance.customer', 'customer');

      if (filter?.SquadUserId) {
        query.innerJoinAndSelect(
          'attendance.squaduser',
          'squaduser',
          'attendance.squaduser = :squaduser',
          { squaduser: filter.SquadUserId },
        );
      } else query.innerJoinAndSelect('attendance.squaduser', 'squaduser');

      query.orderBy('start_date', 'ASC');
      let [attendances, total] = await query.getManyAndCount();

      if (queryParams?.Page && queryParams?.PageSize) {
        const { skip, take } = this.pagination(
          queryParams.Page,
          queryParams.PageSize,
        );

        attendances = attendances.slice(skip, take);
        total = total;
      }

      result.items = attendances;
      result.hasNext = itHasNext(total, queryParams.Page, queryParams.PageSize);
    } catch (error) {
      Logger.error(error);
      console.log(error);

      result._messages = error.message;
    }

    return result;
  }
}
