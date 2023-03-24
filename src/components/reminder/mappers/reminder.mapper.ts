import { Mapper } from 'src/components/shared/mappers/mapper';
import { ReminderDto } from '../dto/reminder.dto';
import { ReminderEntity } from '../entities/reminder.entity';

export class ReminderMapper extends Mapper<ReminderEntity, ReminderDto> {
  public mapFrom(data: ReminderEntity): ReminderDto {
    const reminder = new ReminderDto();

    reminder.id = data.reminderid;
    reminder.customer = {
      id: data.customer.customerid,
      name: data.customer.name,
    };
    reminder.squadUser = {
      id: data.squaduser.squaduserid,
      name: data.squaduser.name,
    };
    reminder.reminder = data.reminder;
    reminder.lastModificatioDate = data.lastmodificationdate;
    reminder.creationDate = data.creationdate;

    return reminder;
  }

  public mapTo(data: ReminderDto): ReminderEntity {
    const reminder = new ReminderEntity();

    reminder.reminderid = data.id;
    reminder.customer = <any>data.customer.id;
    reminder.squaduser = <any>data.squadUser.id;
    reminder.reminder = data.reminder;

    return reminder;
  }
}
