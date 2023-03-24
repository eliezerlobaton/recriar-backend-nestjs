import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { DeleteReminderDto } from '../dto/delete-reminder.dto';
import { ReminderRepositoryInterface } from '../interfaces/reminder.repository.interface';

@Injectable()
export class DeleteReminderUseCase implements UseCase<any> {
  constructor(
    @Inject('ReminderRepositoryInterface')
    private readonly reminderRepository: ReminderRepositoryInterface,
  ) {}

  async execute(deleteReminderDto: DeleteReminderDto) {
    return this.reminderRepository.delete(deleteReminderDto.id);
  }
}
