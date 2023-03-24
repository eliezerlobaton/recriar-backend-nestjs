import { Inject, Injectable } from '@nestjs/common';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { itHasNext } from 'src/components/shared/lib/common-functions';
import { FindConditions, FindManyOptions } from 'typeorm';
import { NoteDto } from '../dto/note.dto';
import { NoteEntity } from '../entities/note.entity';
import { NoteRepositoryInterface } from '../interfaces/note.repository.interface';
import { NoteUseCase } from '../interfaces/note.usecase.interface';
import { NoteMapper } from '../mappers/note.mapper';

@Injectable()
export class GetAllNotesUseCase implements NoteUseCase {
  private readonly mapper = new NoteMapper();
  constructor(
    @Inject('NoteRepositoryInterface')
    private readonly noteRepository: NoteRepositoryInterface,
  ) {}

  async execute(
    queryParams: BaseQueryParametersDTO,
    customerId?: string,
    squadUserId?: string,
  ): Promise<GetBaseResponseDTO<NoteDto[]>> {
    const options: FindManyOptions<NoteEntity> = {};
    const where: FindConditions<NoteEntity> = {};
    const results: GetBaseResponseDTO<NoteDto[]> = {
      items: [],
      hasNext: false,
      _messages: null,
    };
    const hasPagination = queryParams?.Page && queryParams?.PageSize;

    if (customerId) {
      where.customer = <any>customerId;
    }

    if (squadUserId) {
      where.squaduser = <any>squadUserId;
    }

    if (where.customer || where.squaduser) options.where = where;

    if (hasPagination) {
      const { skip, take } = this.noteRepository.pagination(
        queryParams.Page,
        queryParams.PageSize,
      );
      options.skip = skip;
      options.take = take;
    }

    const [notes, total] = await this.noteRepository.findAndCount(options);

    results.hasNext = hasPagination
      ? itHasNext(total, queryParams.Page, queryParams.PageSize)
      : false;

    results.items = notes.map((note) => this.mapper.mapFrom(note));
    return results;
  }
}
