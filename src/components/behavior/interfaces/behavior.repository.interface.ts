import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { BehaviorEntity } from '../entities/behavior.entity';

export interface BehaviorRepositoryInterface
  extends BaseInterfaceRepository<BehaviorEntity> {
  searchByDescriptionAndIntegrationId(
    queryParams: BaseQueryParametersDTO,
  ): Promise<{ items: BehaviorEntity[]; total: number }>;
}
