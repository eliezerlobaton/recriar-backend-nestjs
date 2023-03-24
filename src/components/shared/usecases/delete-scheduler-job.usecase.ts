import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UseCase } from '../interfaces/use-case.interface';

@Injectable()
export class DeleteSchedulerJobUseCase implements UseCase<boolean> {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  execute(id: string): boolean | Promise<boolean> {
    try {
      if (!this.schedulerRegistry.doesExist('cron', id)) {
        throw new NotFoundException(`scheduler job with name ${id} not found!`);
      }
      this.schedulerRegistry.deleteCronJob(id);
    } catch (error) {
      Logger.error(error, 'DeleteSchedulerJob');
      console.log(error);
      return false;
    }
    return true;
  }
}
