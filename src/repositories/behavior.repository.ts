import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BehaviorQueryParametersDTO } from 'src/components/behavior/dto/behavior-query-parameters.dto';
import { BehaviorEntity } from 'src/components/behavior/entities/behavior.entity';
import { BehaviorRepositoryInterface } from 'src/components/behavior/interfaces/behavior.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class BehaviorRepository
  extends BaseAbstractRepository<BehaviorEntity>
  implements BehaviorRepositoryInterface
{
  constructor(
    @InjectRepository(BehaviorEntity)
    private readonly behaviorRepository: Repository<BehaviorEntity>,
  ) {
    super(behaviorRepository);
  }

  async searchByDescriptionAndIntegrationId(
    queryParams: BehaviorQueryParametersDTO,
  ): Promise<{ items: BehaviorEntity[]; total: number }> {
    try {
      const query =
        queryParams?.Page && queryParams?.PageSize
          ? this.queryPagination('behavior', queryParams)
          : this.createQueryBuilder('behavior');
      if (queryParams?.Search) {
        query.andWhere(
          'behavior.description ~* :value OR behavior.integrationid ~* :value OR behavior.behaviorid = :value',
          { value: queryParams.Search },
        );
      }

      if (queryParams?.BehaviorType) {
        query.andWhere('behavior.behavior_type = :type', {
          type: queryParams.BehaviorType,
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
