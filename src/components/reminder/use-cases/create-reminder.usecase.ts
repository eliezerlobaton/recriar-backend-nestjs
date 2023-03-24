import { Inject, Injectable } from '@nestjs/common';
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { ReminderDto } from '../dto/reminder.dto';
import { ReminderRepositoryInterface } from '../interfaces/reminder.repository.interface';
import { ReminderUseCaseInterface } from '../interfaces/reminder.usecase.interface';
import { CreateReminderMapper } from '../mappers/create-reminder.mapper';
import { ReminderMapper } from '../mappers/reminder.mapper';

@Injectable()
export class CreateReminderUseCase implements ReminderUseCaseInterface {
  private readonly createMapper = new CreateReminderMapper();
  private readonly mapper = new ReminderMapper();

  constructor(
    @Inject('ReminderRepositoryInterface')
    private readonly reminderRepository: ReminderRepositoryInterface,
  ) {}

  async execute(createReminderDto: CreateReminderDto): Promise<ReminderDto> {
    const reminderEntity = this.createMapper.mapFrom(createReminderDto);

    const created = await this.reminderRepository.create(reminderEntity);
    const reminder = await this.reminderRepository.findOneById(
      created.reminderid,
    );
    return this.mapper.mapFrom(reminder);
  }
}
