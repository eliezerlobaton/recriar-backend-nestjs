import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeEntity } from '../components/knowledge/entities/knowledge.entity';
import { KnowledgeRepositoryInterface } from '../components/knowledge/interfaces/knowledge.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';

@Injectable()
export class KnowledgeRepository
  extends BaseAbstractRepository<KnowledgeEntity>
  implements KnowledgeRepositoryInterface
{
  constructor(
    @InjectRepository(KnowledgeEntity)
    private readonly knowledgeRepository: Repository<KnowledgeEntity>,
  ) {
    super(knowledgeRepository);
  }

  public async getKnowledgeByKnowledgeObjectiveId(
    knowledgeObjectiveId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<{ result: KnowledgeEntity[]; total: number }> {
    const query = this.queryPagination('knowledge', queryParams);
    query.innerJoinAndSelect(
      'knowledge.knowledgexknowledge_objectives',
      'objectives',
      'objectives.knowledgeobjectiveid = :id',
      { id: knowledgeObjectiveId },
    );
    query.innerJoinAndSelect('knowledge.scale', 'scales');
    const [knowledges, total] = await query.getManyAndCount();

    return { result: knowledges, total };
  }
}
