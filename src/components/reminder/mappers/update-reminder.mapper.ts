import { Mapper } from 'src/components/shared/mappers/mapper';
import { UpdateReminderDto } from '../dto/update-reminder.dto';
import { ReminderEntity } from '../entities/reminder.entity';

export class UpdateReminderMapper extends Mapper<
  UpdateReminderDto,
  Partial<ReminderEntity>
> {
  public mapFrom(data: UpdateReminderDto): Partial<ReminderEntity> {
    const reminder = new ReminderEntity();

    reminder.reminderid = data.id;
    reminder.reminder = data.reminder;

    return reminder;
  }

  public mapTo(data: Partial<ReminderEntity>): UpdateReminderDto {
    const reminder = new UpdateReminderDto();

    reminder.id = data.reminderid;
    reminder.reminder = data.reminder;

    return reminder;
  }
}
