import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteEntity } from 'src/components/services/entities/note.entity';
import { NoteRepositoryInterface } from 'src/components/services/interfaces/note.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class NoteRepository
  extends BaseAbstractRepository<NoteEntity>
  implements NoteRepositoryInterface
{
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
  ) {
    super(noteRepository);
  }
}
