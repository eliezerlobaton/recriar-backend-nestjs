import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { configService } from 'src/config/config.service';
import { CreateEventWatcher } from './create-event-watcher.service';

@Injectable()
export class RenewEventWatcherUseCase implements UseCase<any> {
  constructor(private readonly createEventWatcher: CreateEventWatcher) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async execute() {
    const url = configService.getLokiUrl().split('/').slice(0, -3).join('/');
    const response = await this.createEventWatcher.run(
      `${url}/backend-nest/scheduled-attendance/watcher/event`,
    );
    return response;
  }
}
