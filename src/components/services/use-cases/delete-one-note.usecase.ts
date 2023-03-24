import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { DeleteNoteDto } from '../dto/delete-note.dto';
import { NoteRepositoryInterface } from '../interfaces/note.repository.interface';

@Injectable()
export class DeleteOneNoteUseCase implements UseCase<any> {
  constructor(
    @Inject('NoteRepositoryInterface')
    private readonly noteRepository: NoteRepositoryInterface,
  ) {}

  async execute(deleteNotedto: DeleteNoteDto): Promise<any> {
    return await this.noteRepository.delete(deleteNotedto.id);
  }
}
