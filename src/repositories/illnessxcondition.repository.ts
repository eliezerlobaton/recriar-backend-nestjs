import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IllnessXConditionEntity } from '../components/shared/entities/illnesxcondition.entity';

@Injectable()
export class IllnessXConditionRepository extends BaseAbstractRepository<IllnessXConditionEntity> {
  constructor(
    @InjectRepository(IllnessXConditionEntity)
    private readonly illnessXConditionRepository: Repository<IllnessXConditionEntity>,
  ) {
    super(illnessXConditionRepository);
  }

  async searchByDescriptionAndIntegrationId(
    queryParams: any,
  ): Promise<{ items: IllnessXConditionEntity[]; total: number }> {
    try {
      const query =
        queryParams?.Page && queryParams?.PageSize
          ? this.queryPagination('illnessxcondition', queryParams)
          : this.createQueryBuilder('illnessxcondition');
      if (queryParams?.Search) {
        query.andWhere(
          'illnessxcondition.description ~* :value OR illnessxcondition.integrationid ~* :value OR illnessxcondition.illnessid = :value',
          { value: queryParams.Search },
        );
      }

      if (queryParams?.ConditionId) {
        query.andWhere('illnessxcondition.conditionid = :conditionId', {
          conditionId: queryParams.ConditionId,
        });
      }

      const [items, total] = await query.getManyAndCount();
      return { items, total };
    } catch (error) {
      Logger.error(error);
      Logger.log(error.code.toString());
    }
  }
}
