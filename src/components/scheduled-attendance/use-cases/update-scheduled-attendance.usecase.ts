import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { calendar_v3 } from 'googleapis';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { ScheduledAttendanceDto } from '../dto/scheduled-attendance.dto';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';
import { CreateVideoConferenceRoomUseCase } from './create-video-conference-room.usecase';

@Injectable()
export class UpdateScheduledAttendanceUseCase
  implements UseCase<ScheduledAttendanceDto | boolean>
{
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly attendanceRepository: ScheduledAttendanceRepositoryInterface,
    private readonly createConferance: CreateVideoConferenceRoomUseCase,
  ) {}

  async execute(
    event: calendar_v3.Schema$Event,
  ): Promise<boolean | ScheduledAttendanceDto> {
    try {
      const attendancesFound = await this.attendanceRepository.findByCondition({
        event_id: event.id,
      });

      if (!attendancesFound.length)
        throw new NotFoundException(
          `Attendance with event id ${event.id} not found!`,
        );
      const attendance = attendancesFound.shift();

      attendance.start_date = new Date(event.start.dateTime);
      attendance.end_date = new Date(event.end.dateTime);
      const updatedAttendance = await this.attendanceRepository.updateOne(
        attendance,
      );
      await this.createConferance.execute(
        updatedAttendance.scheduled_attendanceid,
      );
      return ScheduledAttendanceDto.fromEntity(
        await this.attendanceRepository.findOneByIdWithRelations(
          updatedAttendance.scheduled_attendanceid,
        ),
      );
    } catch (error) {
      Logger.error(error, 'UpdateScheduledAttendance');
      console.log(error);
      return false;
    }
  }
}
