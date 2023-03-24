import { Inject, Injectable } from '@nestjs/common';
import { NoteDto } from '../dto/note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { NoteRepositoryInterface } from '../interfaces/note.repository.interface';
import { NoteUseCase } from '../interfaces/note.usecase.interface';
import { NoteMapper } from '../mappers/note.mapper';
import { UpdateNoteMapper } from '../mappers/update-note.mapper';

@Injectable()
export class UpdateOneNoteUseCase implements NoteUseCase {
  private readonly updateMapper = new UpdateNoteMapper();
  private readonly mapper = new NoteMapper();

  constructor(
    @Inject('NoteRepositoryInterface')
    private readonly noteRepository: NoteRepositoryInterface,
  ) {}

  async execute(updateNoteDto: UpdateNoteDto): Promise<NoteDto> {
    const noteEntity = this.updateMapper.mapFrom(updateNoteDto);
    const updated = await this.noteRepository.updateOne(noteEntity);
    const note = await this.noteRepository.findOneById(updated.noteid);
    return this.mapper.mapFrom(note);
  }
}
