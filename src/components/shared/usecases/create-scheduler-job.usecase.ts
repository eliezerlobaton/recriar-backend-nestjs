import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronCommand, CronJob } from 'cron';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class CreateSchedulerJobUseCase implements UseCase<boolean> {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute(id: string, date: Date, func: CronCommand): boolean {
    try {
      if (this.schedulerRegistry.doesExist('cron', id)) {
        this.schedulerRegistry.deleteCronJob(id);
      }
      const job = new CronJob(date, func);
      this.schedulerRegistry.addCronJob(id, job);
      job.start();
    } catch (error) {
      Logger.error(error, 'CreateScheduledJob');
      console.log(error);
      return false;
    }
    return true;
  }
}
