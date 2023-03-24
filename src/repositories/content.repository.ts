import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentEntity } from '../components/content/entities/content.entity';
import { ContentRepositoryInterface } from '../components/content/interfaces/content.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { ContentFilterQueryDTO } from 'src/components/content/dto/content-filter-query.dto';

@Injectable()
export class ContentRepository
  extends BaseAbstractRepository<ContentEntity>
  implements ContentRepositoryInterface
{
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
  ) {
    super(contentRepository);
  }

  public async findAllByQuery(queryParams: ContentFilterQueryDTO) {
    const query = this.queryPagination('content', queryParams);

    if (queryParams?.KnowledgeId) {
      query.innerJoin(
        'content.contentxknowledges',
        'knowledges',
        'knowledges.knowledgeid = :id',
        { id: queryParams.KnowledgeId },
      );
    }

    if (queryParams?.Search) {
      query.andWhere(
        'content.title ~* :value OR content.integrationid ~* :value',
        { value: queryParams.Search },
      );
    }

    const [contents, total] = await query.getManyAndCount();
    return { result: contents, total };
  }
}
