import { Mapper } from 'src/components/shared/mappers/mapper';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { NoteEntity } from '../entities/note.entity';

export class UpdateNoteMapper extends Mapper<UpdateNoteDto, NoteEntity> {
  mapFrom(data: UpdateNoteDto): NoteEntity {
    const note = new NoteEntity();

    note.noteid = data.id;
    note.customer = <any>data.customer;
    note.squaduser = <any>data.squad;
    note.category = data.category;
    note.note = data.note;

    return note;
  }

  mapTo(data: NoteEntity): UpdateNoteDto {
    const note = new UpdateNoteDto();

    note.category = data.category;
    note.customer = data.customer.customerid;
    note.squad = data.squaduser.squaduserid;
    note.note = data.note;
    note.id = data.noteid;

    return note;
  }
}
