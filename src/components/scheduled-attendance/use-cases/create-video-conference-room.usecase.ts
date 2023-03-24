import { Inject, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronCommand, CronJob } from 'cron';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { TwilioRoomType } from 'src/components/video-conference/api/enum/twilio-room-types.enum';
import { RoomDTO } from 'src/components/video-conference/dto/room.dto';
import { VideoConferenceApiInterface } from 'src/components/video-conference/interfaces/video-conference.api.interface';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';
import { StartCreateRoomJobsUseCase } from './start-create-room-jobs.usecase';

@Injectable()
export class CreateVideoConferenceRoomUseCase implements UseCase<void> {
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly scheduledAttendanceRepository: ScheduledAttendanceRepositoryInterface,
    @Inject('VideoConferenceApiService')
    private readonly videoApiService: VideoConferenceApiInterface<TwilioRoomType>,
    private schedulerRegistry: SchedulerRegistry,
    private startJobs: StartCreateRoomJobsUseCase,
  ) {
    this.startJobs.execute(
      async (attendanceId: string) => await this.execute(attendanceId),
    );
  }

  private async createCronJob(
    date: Date,
    id: string,
    functionJob: CronCommand,
  ): Promise<void> {
    try {
      if (this.schedulerRegistry.doesExist('cron', id)) {
        this.schedulerRegistry.deleteCronJob(id);
      }
      const job = new CronJob(date, functionJob);

      this.schedulerRegistry.addCronJob(id, job);
      return await job.start();
    } catch (error) {
      Logger.error(error, 'CreateVideoConferenceRoomUseCase.createCronJob');
    }
  }

  private deleteCron(scheduleAttendanceId: string) {
    try {
      this.schedulerRegistry.deleteCronJob(scheduleAttendanceId);
    } catch (error) {
      Logger.error(error, 'CreateVideoConferenceRoomUseCase.deleteCronJob');
    }
  }

  private async createRoom(scheduleAttendanceId: string): Promise<RoomDTO> {
    const attendance = await this.scheduledAttendanceRepository.findOneById(
      scheduleAttendanceId,
    );

    const room = await this.videoApiService.createRoom(
      attendance.scheduled_attendanceid,
      TwilioRoomType.Group,
    );

    attendance.attendance_url = room.url;
    await this.scheduledAttendanceRepository.updateOne(attendance);
    this.deleteCron(attendance.scheduled_attendanceid);
    return room;
  }

  async execute(scheduleAttendanceId: string): Promise<void> {
    const attendance = await this.scheduledAttendanceRepository.findOneById(
      scheduleAttendanceId,
    );
    const startDate = attendance.start_date;
    startDate.setMinutes(startDate.getMinutes() - 5);

    await this.createCronJob(
      startDate,
      attendance.scheduled_attendanceid,
      async () => {
        await this.createRoom(attendance.scheduled_attendanceid);
      },
    );
    const endDate = attendance.end_date;
    endDate.setMinutes(endDate.getMinutes() + 15);

    await this.createCronJob(
      endDate,
      `status:${attendance.scheduled_attendanceid}`,
      async () => {
        attendance.status = ScheduledAttendanceStatus.Realized;
        await this.scheduledAttendanceRepository.updateOne(attendance);
      },
    );
  }
}
