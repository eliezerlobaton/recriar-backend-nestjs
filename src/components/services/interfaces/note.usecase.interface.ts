import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { NoteDto } from '../dto/note.dto';

export type NoteUseCase = UseCase<
  NoteDto | NoteDto[] | GetBaseResponseDTO<NoteDto[]>
>;
