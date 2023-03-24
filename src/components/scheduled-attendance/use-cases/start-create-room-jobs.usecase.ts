import { Inject, Logger } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { MoreThan } from 'typeorm';
import { ScheduledAttendanceEntity } from '../entities/scheduled-attendance.entity';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';

export class StartCreateRoomJobsUseCase implements UseCase<void> {
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly scheduledRepository: ScheduledAttendanceRepositoryInterface,
  ) {}

  private async getAttendancesByStartDate(): Promise<
    ScheduledAttendanceEntity[]
  > {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 15);
    const attendances = await this.scheduledRepository.findByCondition({
      start_date: MoreThan(date),
    });
    return attendances;
  }

  async execute(addCronFunction: CallableFunction): Promise<void> {
    const attendances = await this.getAttendancesByStartDate();
    const results = attendances.map(async (attendance) => {
      try {
        return await addCronFunction(attendance.scheduled_attendanceid);
      } catch (error) {
        Logger.error(error, 'StartCreateRoomJobsUseCase');
      }
    });
    await Promise.all(results);
  }
}
