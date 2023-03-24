import { Inject, Injectable } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteDto } from '../dto/note.dto';
import { NoteRepositoryInterface } from '../interfaces/note.repository.interface';
import { NoteUseCase } from '../interfaces/note.usecase.interface';
import { CreateNoteMapper } from '../mappers/create-note.mapper';
import { NoteMapper } from '../mappers/note.mapper';

@Injectable()
export class CreateNoteUseCase implements NoteUseCase {
  private readonly createMapper = new CreateNoteMapper();
  private readonly noteMapper = new NoteMapper();

  constructor(
    @Inject('NoteRepositoryInterface')
    private readonly noteRepository: NoteRepositoryInterface,
  ) {}

  async execute(createNoteDto: CreateNoteDto): Promise<NoteDto> {
    const created = await this.noteRepository.create(
      this.createMapper.mapFrom(createNoteDto),
    );
    const noteEntity = await this.noteRepository.findOneById(created.noteid);
    return this.noteMapper.mapFrom(noteEntity);
  }
}
