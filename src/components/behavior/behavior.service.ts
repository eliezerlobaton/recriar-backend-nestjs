import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { itHasNext } from '../shared/lib/common-functions';
import { CreateBehaviorDTO } from './dto/create-behavior.dto';
import { UpdateBehaviorDTO } from './dto/update-behavior.dto';
import { BehaviorEntity } from './entities/behavior.entity';
import { BehaviorType } from './enum/behavior-type.enum';
import { BehaviorRepositoryInterface } from './interfaces/behavior.repository.interface';
import { BehaviorServiceInterface } from './interfaces/behavior.service.interface';

@Injectable()
export class BehaviorService implements BehaviorServiceInterface {
  constructor(
    @Inject('BehaviorRepositoryInterface')
    private readonly behaviorRepository: BehaviorRepositoryInterface,
  ) {}

  async create(createBehaviorDto: CreateBehaviorDTO): Promise<BehaviorEntity> {
    if (createBehaviorDto.behaviorType === BehaviorType.Question) {
      createBehaviorDto.formLink = null;
      createBehaviorDto.activityText = null;
    }
    return await this.behaviorRepository.create(
      CreateBehaviorDTO.fromDTO(createBehaviorDto),
    );
  }

  async findAll(
    queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<BehaviorEntity[]>> {
    const { items, total } =
      await this.behaviorRepository.searchByDescriptionAndIntegrationId(
        queryParams,
      );
    const hasNext =
      queryParams?.Page && queryParams?.PageSize
        ? itHasNext(total, queryParams.Page, queryParams.PageSize)
        : false;

    return {
      items,
      hasNext,
      _messages: '',
    };
  }

  async findOne(id: string): Promise<BehaviorEntity> {
    return await this.behaviorRepository.findOneById(id);
  }

  async update(updateBehaviorDto: UpdateBehaviorDTO): Promise<BehaviorEntity> {
    const found = await this.findOne(updateBehaviorDto.id);
    if (!found) throw new UnprocessableEntityException('Register not found');
    return this.behaviorRepository.updateOne(
      UpdateBehaviorDTO.fromDTO(updateBehaviorDto),
    );
  }

  async remove(id: string): Promise<BehaviorEntity> {
    const found = await this.findOne(id);
    console.log(found);

    if (!found) throw new UnprocessableEntityException('Register not found');
    const deleted = await this.behaviorRepository.delete(id);
    if (deleted.affected <= 0)
      throw new InternalServerErrorException('Unable to remove register');

    return found;
  }
}
