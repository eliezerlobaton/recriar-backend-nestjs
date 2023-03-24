import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeObjectiveFilterQueryDTO } from 'src/components/knowledge-objective/dto/knowledge-objective-filter-query.dto';
import { KnowledgeObjectiveRepositoryInterface } from 'src/components/knowledge-objective/interfaces/knowledge-objective.repository.interface';
import { KnowledgeObjectiveEntity } from 'src/components/knowledge-objective/entities/knowledge-objective.entity';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

export class KnowledgeObjectiveRepository
  extends BaseAbstractRepository<KnowledgeObjectiveEntity>
  implements KnowledgeObjectiveRepositoryInterface
{
  constructor(
    @InjectRepository(KnowledgeObjectiveEntity)
    private readonly knowledgeObjectiveRepository: Repository<KnowledgeObjectiveEntity>,
  ) {
    super(knowledgeObjectiveRepository);
  }

  public async getByKnowledgeConditionId(
    knowledgeConditionId: string,
    queryParams: KnowledgeObjectiveFilterQueryDTO,
  ): Promise<KnowledgeObjectiveEntity[]> {
    const query = this.knowledgeObjectiveRepository.createQueryBuilder(
      'knowledge_objective',
    );
    query.innerJoin(
      'knowledge_objective.knowledge_objectivexknowledge_condition',
      'condition',
      'condition.knowledgeconditionid = :id',
      { id: knowledgeConditionId },
    );

    const knowledgesObjectives = await query.getMany();
    return knowledgesObjectives;
  }
}
