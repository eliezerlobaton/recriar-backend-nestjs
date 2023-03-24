import { ReminderDto } from 'src/components/reminder/dto/reminder.dto';
import { BaseEntityInformationDto } from 'src/components/shared/dto/base-entity-information.dto';

export class CustomerResponsibleDto {
  customer: BaseEntityInformationDto;
  company: BaseEntityInformationDto;
  squadUser: BaseEntityInformationDto;
  reminder: Partial<ReminderDto>;
}
