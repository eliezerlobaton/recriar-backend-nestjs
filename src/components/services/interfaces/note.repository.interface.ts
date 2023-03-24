import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { NoteEntity } from '../entities/note.entity';

export type NoteRepositoryInterface = BaseInterfaceRepository<NoteEntity>;
