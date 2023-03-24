import { Inject, Injectable } from '@nestjs/common';
import { ReminderDto } from '../dto/reminder.dto';
import { ReminderRepositoryInterface } from '../interfaces/reminder.repository.interface';
import { ReminderUseCaseInterface } from '../interfaces/reminder.usecase.interface';
import { ReminderMapper } from '../mappers/reminder.mapper';

@Injectable()
export class GetOneReminderUseCase implements ReminderUseCaseInterface {
  private readonly mapper = new ReminderMapper();
  constructor(
    @Inject('ReminderRepositoryInterface')
    private readonly reminderRepository: ReminderRepositoryInterface,
  ) {}

  async execute(reminderId: string): Promise<ReminderDto> {
    const reminder = await this.reminderRepository.findOneById(reminderId);
    return this.mapper.mapFrom(reminder);
  }
}
