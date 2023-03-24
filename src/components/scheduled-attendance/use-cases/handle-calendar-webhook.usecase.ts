import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { calendar_v3 } from 'googleapis';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';
import { CancelScheduledAttendanceUseCase } from './cancel-scheduled-attendance.usecase';
import { CreateScheduledAttendanceUseCase } from './create-scheduled-attendance.usecase';
import { GetLatestGoogleCalendarEvents } from './get-latest-google-calendar-events.service';
import { UpdateScheduledAttendanceUseCase } from './update-scheduled-attendance.usecase';
import { ValidateCalendarChannelToken } from './validate-calendar-channel-token.service';

@Injectable()
export class HandleCalendarWebhookUseCase implements UseCase<any> {
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly attendandceRepository: ScheduledAttendanceRepositoryInterface,
    private readonly validateToken: ValidateCalendarChannelToken,
    private readonly getLastestEvents: GetLatestGoogleCalendarEvents,
    private readonly cancel: CancelScheduledAttendanceUseCase,
    private readonly create: CreateScheduledAttendanceUseCase,
    private readonly update: UpdateScheduledAttendanceUseCase,
  ) {}

  private async selectOperation(event: calendar_v3.Schema$Event) {
    const cancelRgx = /^(Cancelar:)/g;
    if (event.summary.match(cancelRgx)) return this.cancel;
    const found = await this.attendandceRepository.findOneByCondition({
      event_id: event.id,
    });
    if (found) return this.update;
    return this.create;
  }

  async execute(token: string) {
    if (!this.validateToken.run({ token }))
      throw new BadRequestException('wrong channel token');

    const events = await this.getLastestEvents.run();

    const results = events.map(async (event) => {
      return await (await this.selectOperation(event)).execute(event);
    });

    return Promise.all(results);
  }
}
