import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { ReminderEntity } from '../entities/reminder.entity';

export type ReminderRepositoryInterface =
  BaseInterfaceRepository<ReminderEntity>;
