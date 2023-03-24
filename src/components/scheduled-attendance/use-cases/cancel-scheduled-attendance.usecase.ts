import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { calendar_v3 } from 'googleapis';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { DeleteSchedulerJobUseCase } from 'src/components/shared/usecases/delete-scheduler-job.usecase';
import { ScheduledAttendanceDto } from '../dto/scheduled-attendance.dto';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';
import { UpdateFirebaseAttendanceUseCase } from './firebase/update-firebase-attendance.usecase';

@Injectable()
export class CancelScheduledAttendanceUseCase
  implements UseCase<ScheduledAttendanceDto | boolean>
{
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly attendanceRepository: ScheduledAttendanceRepositoryInterface,
    private readonly deleteSchedulerJob: DeleteSchedulerJobUseCase,
    private readonly updateFirebase: UpdateFirebaseAttendanceUseCase,
  ) {}

  async execute(
    calendarEvent: calendar_v3.Schema$Event,
  ): Promise<ScheduledAttendanceDto | boolean> {
    try {
      const eventId = calendarEvent.id;
      const [eventToCancel] = await this.attendanceRepository.findWithRelations(
        {
          relations: ['squaduser', 'customer'],
          where: {
            event_id: eventId,
          },
          take: 1,
        },
      );

      if (!eventToCancel)
        throw new NotFoundException(
          `Attendance with event_id ${eventId} not found!`,
        );

      eventToCancel.status = ScheduledAttendanceStatus.Cancelled;
      const updated = await this.attendanceRepository.updateOne(eventToCancel);

      if (!updated)
        throw new InternalServerErrorException(
          `It was not possible to cancel attendance ${eventId}`,
        );
      this.deleteSchedulerJob.execute(eventToCancel.scheduled_attendanceid);
      this.deleteSchedulerJob.execute(
        `status:${eventToCancel.scheduled_attendanceid}`,
      );
      const event = await this.attendanceRepository.findOneByIdWithRelations(
        updated.scheduled_attendanceid,
      );
      await this.updateFirebase.execute(
        event.squaduser.squaduserid,
        event.scheduled_attendanceid,
        'status',
        ScheduledAttendanceStatus.Cancelled,
      );
      return ScheduledAttendanceDto.fromEntity(event);
    } catch (error) {
      Logger.error(error, 'CancelScheduledAttendance');
      console.log(error);
      return false;
    }
  }
}
