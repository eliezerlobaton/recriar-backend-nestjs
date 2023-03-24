import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReminderEntity } from 'src/components/reminder/entities/reminder.entity';
import { ReminderRepositoryInterface } from 'src/components/reminder/interfaces/reminder.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class ReminderRepository
  extends BaseAbstractRepository<ReminderEntity>
  implements ReminderRepositoryInterface
{
  constructor(
    @InjectRepository(ReminderEntity)
    private readonly reminderRepository: Repository<ReminderEntity>,
  ) {
    super(reminderRepository);
  }
}
