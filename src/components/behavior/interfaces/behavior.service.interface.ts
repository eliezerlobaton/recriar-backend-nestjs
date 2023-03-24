import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { CreateBehaviorDTO } from '../dto/create-behavior.dto';
import { UpdateBehaviorDTO } from '../dto/update-behavior.dto';
import { BehaviorEntity } from '../entities/behavior.entity';

export interface BehaviorServiceInterface {
  create(createBehaviorDto: CreateBehaviorDTO): Promise<BehaviorEntity>;
  findAll(
    queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<BehaviorEntity[]>>;
  findOne(id: string): Promise<BehaviorEntity>;
  update(updateBehaviorDto: UpdateBehaviorDTO): Promise<BehaviorEntity>;
  remove(id: string): Promise<BehaviorEntity>;
}
