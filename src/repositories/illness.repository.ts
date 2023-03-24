import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IllnessEntity } from '../components/illness/entities/illness.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class IllnessRepository extends BaseAbstractRepository<IllnessEntity> {
  constructor(
    @InjectRepository(IllnessEntity)
    private readonly illnessRepository: Repository<IllnessEntity>,
  ) {
    super(illnessRepository);
  }

  async searchByDescriptionAndIntegrationId(
    queryParams: any,
  ): Promise<{ items: IllnessEntity[]; total: number }> {
    try {
      const query =
        queryParams?.Page && queryParams?.PageSize
          ? this.queryPagination('illness', queryParams)
          : this.createQueryBuilder('illness');
      if (queryParams?.Search) {
        query.andWhere(
          'illness.description ~* :value OR illness.integrationid ~* :value OR illness.illnessid = :value',
          { value: queryParams.Search },
        );
      }

      if (queryParams?.ConditionId) {
        query.andWhere('illness.conditionid = :conditionId', {
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
