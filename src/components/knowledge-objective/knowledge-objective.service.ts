import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { KnowledgeConditionRepository } from 'src/repositories/knowledge-condition.repository';
import { KnowledgeObjectiveRepository } from 'src/repositories/knowledge-objective.repository';
import { CustomerRepositoryInterface } from '../customer/interfaces/customer.repository.interface';
import { KnowledgeObjectiveDTO } from './dto/knowledge-objective.dto';
import { KnowledgeType } from '../shared/dto/enums/common-enum';
import { KnowledgeObjectiveEntity } from './entities/knowledge-objective.entity';
import { KnowledgeObjectiveFilterQueryDTO } from './dto/knowledge-objective-filter-query.dto';
import { KnowledgeObjectiveServiceInterface } from './interfaces/knowledge-objective.interface';

@Injectable()
export class KnowledgeObjectiveService
  implements KnowledgeObjectiveServiceInterface
{
  constructor(
    @Inject('KnowledgeObjectiveRepository')
    private readonly knowledgeObjectiveRepository: KnowledgeObjectiveRepository,

    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,

    @Inject('KnowledgeConditionRepository')
    private readonly knowledgeCondition: KnowledgeConditionRepository,
  ) {}

  async CustomerObjectives(
    customerId: string,
    queryParams: KnowledgeObjectiveFilterQueryDTO,
  ): Promise<{ objectives: KnowledgeObjectiveDTO[]; hasNext: boolean }> {
    const customer = await this.customerRepository.findOneById(customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (queryParams?.KnowledgeType === KnowledgeType.General) {
      const generalObjectives =
        await this.knowledgeObjectiveRepository.findByCondition({
          knowledgetype: 'General',
        });
      return {
        objectives: generalObjectives.map((objective) =>
          KnowledgeObjectiveDTO.fromEntity(objective),
        ),
        hasNext: false,
      };
    }

    const quizCodes = (customer?.quizcodes as unknown as string[]) ?? [];

    const conditionsPromises = quizCodes.map(async (quizId) => {
      const result =
        await this.knowledgeCondition.getKnowledgeConditionByQuizId(quizId, {});
      return result;
    });

    let conditions = await (
      await Promise.all(conditionsPromises)
    ).reduce((prev, curr) => prev.concat(curr), []);

    conditions = conditions.filter(
      (condition, index, array) =>
        array.findIndex(
          (t) => t.knowledge_conditionid === condition.knowledge_conditionid,
        ) === index,
    );

    const objectivesPromises = conditions.map(async (condition) => {
      const result =
        await this.knowledgeObjectiveRepository.getByKnowledgeConditionId(
          condition.knowledge_conditionid,
          queryParams,
        );
      return result;
    });

    let objectives: KnowledgeObjectiveDTO[] | KnowledgeObjectiveEntity[] = (
      await Promise.all(objectivesPromises)
    ).reduce((prev, curr) => prev.concat(curr), []);
    objectives = objectives.map((objectiveEntity) =>
      KnowledgeObjectiveDTO.fromEntity(objectiveEntity),
    );

    if (queryParams?.KnowledgeType === undefined) {
      const generalObjectives =
        await this.knowledgeObjectiveRepository.findByCondition({
          knowledgetype: 'General',
        });
      objectives = [
        ...generalObjectives.map((obj) =>
          KnowledgeObjectiveDTO.fromEntity(obj),
        ),
      ].concat(objectives);
    }

    objectives = objectives.filter(
      (objective, index, array) =>
        array.findIndex((t) => t.id === objective.id) === index,
    );

    const { Page: page = 1, PageSize: pageSize = 10 } = queryParams;
    const pageStart = (page - 1) * pageSize;
    const hasNext = page * pageSize < objectives.length;
    const pageEnd = !hasNext ? objectives.length : page * pageSize;

    return {
      objectives: objectives.slice(pageStart, pageEnd),
      hasNext: hasNext,
    };
  }
}
