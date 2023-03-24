import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseQueryParametersDTO } from "src/components/shared/dto/base-query-parameters.dto";
import { KnowledgeConditionEntity } from "src/components/shared/entities/knowledge-condition.entity";
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "./base/base.abstract.repository";
import { BaseInterfaceRepository } from "./base/base.interface.repository";

@Injectable()
export class KnowledgeConditionRepository
  extends BaseAbstractRepository<KnowledgeConditionEntity>
  implements BaseInterfaceRepository<KnowledgeConditionEntity>
{
  constructor(
    @InjectRepository(KnowledgeConditionEntity)
    private readonly knowledgeConditionRepository: Repository<KnowledgeConditionEntity>,
  ) {
    super(knowledgeConditionRepository);
  }

  public async getKnowledgeConditionByQuizId(
    quizId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<KnowledgeConditionEntity[]> {
    const query = this.knowledgeConditionRepository.createQueryBuilder('knowledge_condition');
    const knowledgesConditions = await query
      .innerJoin(
        'knowledge_condition.knowledge_conditionxquiz',
        'quiz',
        'quiz.quizid = :id',
        { id: quizId },
      )
      .getMany();
    return knowledgesConditions;
  }
}
