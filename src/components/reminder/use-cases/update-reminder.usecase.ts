import { Inject, Injectable } from '@nestjs/common';
import { ReminderDto } from '../dto/reminder.dto';
import { UpdateReminderDto } from '../dto/update-reminder.dto';
import { ReminderRepositoryInterface } from '../interfaces/reminder.repository.interface';
import { ReminderUseCaseInterface } from '../interfaces/reminder.usecase.interface';
import { ReminderMapper } from '../mappers/reminder.mapper';
import { UpdateReminderMapper } from '../mappers/update-reminder.mapper';

@Injectable()
export class UpdateReminderUseCase implements ReminderUseCaseInterface {
  private readonly updateMapper = new UpdateReminderMapper();
  private readonly mapper = new ReminderMapper();
  constructor(
    @Inject('ReminderRepositoryInterface')
    private readonly reminderRepository: ReminderRepositoryInterface,
  ) {}

  async execute(updateReminderDto: UpdateReminderDto): Promise<ReminderDto> {
    const reminderEntity = this.updateMapper.mapFrom(updateReminderDto);
    const updated = await this.reminderRepository.updateOne(reminderEntity);
    const reminder = await this.reminderRepository.findOneById(
      updated.reminderid,
    );
    return this.mapper.mapFrom(reminder);
  }
}
