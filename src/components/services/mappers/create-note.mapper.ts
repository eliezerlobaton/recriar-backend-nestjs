import { Mapper } from 'src/components/shared/mappers/mapper';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteEntity } from '../entities/note.entity';

export class CreateNoteMapper extends Mapper<CreateNoteDto, NoteEntity> {
  public mapFrom(data: CreateNoteDto): NoteEntity {
    const note = new NoteEntity();

    note.customer = <any>data.customer;
    note.squaduser = <any>data.squad;
    note.note = data.note;
    note.category = data.category;

    return note;
  }

  public mapTo(data: NoteEntity): CreateNoteDto {
    const note = new CreateNoteDto();

    note.category = data.category;
    note.customer = data.customer.customerid;
    note.squad = data.squaduser.squaduserid;
    note.note = data.note;

    return note;
  }
}
