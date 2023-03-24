import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { ReminderDto } from '../dto/reminder.dto';

export type ReminderUseCaseInterface = UseCase<
  ReminderDto | ReminderDto[] | GetBaseResponseDTO<ReminderDto[]>
>;
