import { Mapper } from 'src/components/shared/mappers/mapper';
import { NoteDto } from '../dto/note.dto';
import { NoteEntity } from '../entities/note.entity';

export class NoteMapper extends Mapper<NoteEntity, NoteDto> {
  public mapFrom(data: NoteEntity): NoteDto {
    const note = new NoteDto();

    note.id = data.noteid;
    note.category = data.category;
    note.customerId = data.customer.customerid;
    note.squadUserId = data.squaduser.squaduserid;
    note.squadUser = <any>data.squaduser;
    note.note = data.note;
    note.creationDate = data.creationdate;

    return note;
  }

  public mapTo(data: NoteDto): NoteEntity {
    const note = new NoteEntity();

    note.noteid = data.id;
    note.category = data.category;
    note.customer = <any>data.customerId;
    note.squaduser = <any>data.squadUserId;
    note.note = data.note;

    return note;
  }
}
