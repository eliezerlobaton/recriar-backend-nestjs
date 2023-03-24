import { Mapper } from 'src/components/shared/mappers/mapper';
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { ReminderEntity } from '../entities/reminder.entity';

export class CreateReminderMapper extends Mapper<
  CreateReminderDto,
  ReminderEntity
> {
  public mapFrom(data: CreateReminderDto): ReminderEntity {
    const reminder = new ReminderEntity();

    reminder.customer = <any>data.customerId;
    reminder.squaduser = <any>data.squadUserId;
    reminder.reminder = data.reminder;

    return reminder;
  }

  public mapTo(data: ReminderEntity): CreateReminderDto {
    const reminder = new CreateReminderDto();

    reminder.customerId = data.customer.customerid;
    reminder.squadUserId = data.squaduser.squaduserid;
    reminder.reminder = data.reminder;

    return reminder;
  }
}
