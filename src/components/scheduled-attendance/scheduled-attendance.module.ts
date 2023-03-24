import { Module } from '@nestjs/common';
import { ScheduledAttendanceService } from './scheduled-attendance.service';
import { ScheduledAttendanceController } from './scheduled-attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledAttendanceEntity } from './entities/scheduled-attendance.entity';
import { ScheduledAttendanceRepository } from 'src/repositories/scheduled-attendence.repository';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { SquadUserEntity } from '../shared/entities/squad-user.entity';
import { CreateMockAttendancesService } from './use-cases/create-mock-attendances.service';
import { SquadUserRepository } from 'src/repositories/squad-user.repositoy';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { VideoConferenceModule } from '../video-conference/video-conference.module';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/config/config.service';
import { CreateVideoConferenceRoomUseCase } from './use-cases/create-video-conference-room.usecase';
import { CreateEventWatcher } from './use-cases/create-event-watcher.service';
import { AuthenticateGoogleApi } from './use-cases/authenticate-google-api.service';
import { GetLatestGoogleCalendarEvents } from './use-cases/get-latest-google-calendar-events.service';
import { ValidateCalendarChannelToken } from './use-cases/validate-calendar-channel-token.service';
import { TeamSquadEntity } from '../teamsquad/entities/team-squad.entity';
import { TeamSquadRepository } from 'src/repositories/team-squad.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { HandleRoomUpdates } from './use-cases/handle-room-updates.service';
import { StartCreateRoomJobsUseCase } from './use-cases/start-create-room-jobs.usecase';
import { UpdateAttendancesStatusUseCase } from './use-cases/update-attendance-status.usecase';
import { DeleteEventWatcherUseCase } from './use-cases/delete-watcher.usecase';
import { RenewEventWatcherUseCase } from './use-cases/renew-event-watcher.usecase';
import { DeleteSchedulerJobUseCase } from '../shared/usecases/delete-scheduler-job.usecase';
import { HandleCalendarWebhookUseCase } from './use-cases/handle-calendar-webhook.usecase';
import { CancelScheduledAttendanceUseCase } from './use-cases/cancel-scheduled-attendance.usecase';
import { CreateScheduledAttendanceUseCase } from './use-cases/create-scheduled-attendance.usecase';
import { UpdateScheduledAttendanceUseCase } from './use-cases/update-scheduled-attendance.usecase';
import { CreateFirebaseAttendanceUseCase } from './use-cases/firebase/create-firebase-attendance.usecase';
import { UpdateFirebaseAttendanceUseCase } from './use-cases/firebase/update-firebase-attendance.usecase';

const scheduledAttendanceRepository = {
  provide: 'ScheduledAttendanceRepositoryInterface',
  useClass: ScheduledAttendanceRepository,
};

const scheduledService = {
  provide: 'ScheduledAttendanceServiceInterface',
  useClass: ScheduledAttendanceService,
};

const squadUserRepositoryInterface = {
  provide: 'SquadUserRepositoryInterface',
  useClass: SquadUserRepository,
};

const teamSquadRepositoryInterface = {
  provide: 'TeamSquadRepositoryInterface',
  useClass: TeamSquadRepository,
};

const customerRepositoryInterface = {
  provide: 'CustomerRepositoryInterface',
  useClass: CustomerRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ScheduledAttendanceEntity,
      CustomerEntity,
      SquadUserEntity,
      TeamSquadEntity,
    ]),
    VideoConferenceModule,
    JwtModule.register({ secret: configService.getJwtSecret() }),
    FirebaseModule,
  ],
  providers: [
    ScheduledAttendanceService,
    CreateMockAttendancesService,
    CreateVideoConferenceRoomUseCase,
    CreateEventWatcher,
    AuthenticateGoogleApi,
    GetLatestGoogleCalendarEvents,
    ValidateCalendarChannelToken,
    HandleRoomUpdates,
    StartCreateRoomJobsUseCase,
    UpdateAttendancesStatusUseCase,
    DeleteEventWatcherUseCase,
    RenewEventWatcherUseCase,
    DeleteSchedulerJobUseCase,
    HandleCalendarWebhookUseCase,
    CancelScheduledAttendanceUseCase,
    CreateScheduledAttendanceUseCase,
    UpdateScheduledAttendanceUseCase,
    UpdateFirebaseAttendanceUseCase,
    CreateFirebaseAttendanceUseCase,
    squadUserRepositoryInterface,
    customerRepositoryInterface,
    scheduledAttendanceRepository,
    scheduledService,
    teamSquadRepositoryInterface,
  ],
  controllers: [ScheduledAttendanceController],
  exports: ['ScheduledAttendanceRepositoryInterface'],
})
export class ScheduledAttendanceModule {}
