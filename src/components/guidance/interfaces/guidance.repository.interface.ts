import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { GuidanceQueryParametersDTO } from '../dto/guidance-query-parameters.dto';
import { GuidanceEntity } from '../entities/guidance.entity';

export interface GuidanceRepositoryInterface
  extends BaseInterfaceRepository<GuidanceEntity> {
  findAllByCustomerId(
    customerId: string,
    queryParams: GuidanceQueryParametersDTO,
    withDeteled?: boolean,
    responsibleId?: string,
  ): Promise<GetBaseResponseDTO<GuidanceEntity[]>>;
  findOneById(
    guidanceId: string,
    withDeteled?: boolean,
  ): Promise<GuidanceEntity>;
}
