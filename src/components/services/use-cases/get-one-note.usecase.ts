import { Inject, Injectable } from '@nestjs/common';
import { NoteDto } from '../dto/note.dto';
import { NoteRepositoryInterface } from '../interfaces/note.repository.interface';
import { NoteUseCase } from '../interfaces/note.usecase.interface';
import { NoteMapper } from '../mappers/note.mapper';

@Injectable()
export class GetOneNoteUseCase implements NoteUseCase {
  private readonly mapper = new NoteMapper();
  constructor(
    @Inject('NoteRepositoryInterface')
    private readonly noteRepository: NoteRepositoryInterface,
  ) {}

  async execute(id: string): Promise<NoteDto> {
    const note = await this.noteRepository.findOneById(id);
    return this.mapper.mapFrom(note);
  }
}
