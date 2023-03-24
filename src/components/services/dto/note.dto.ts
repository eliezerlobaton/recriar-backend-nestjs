import { SquadUserDto } from 'src/components/shared/dto/squad-user.dto';

export class NoteDto {
  id: string;
  category: string;
  note: string;
  customerId: string;
  squadUserId: string;
  squadUser: SquadUserDto;
  creationDate: Date;
}
