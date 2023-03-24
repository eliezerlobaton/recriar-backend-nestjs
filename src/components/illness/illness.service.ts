import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConditionRepository } from 'src/repositories/condition.repository';

import { IllnessRepository } from './../../repositories/illness.repository';
import { CreateIllnessDto } from './dto/create-illness.dto';
import { UpdateIllnessDto } from './dto/update-illness.dto';
import { IllnessEntity } from './entities/illness.entity';

@Injectable()
export class IllnessService {
  constructor(
    @Inject('IllnessRepositoryService')
    private readonly illnessRepository: IllnessRepository,
    @Inject('ConditionRepositoryService')
    private readonly conditionRepository: ConditionRepository,
  ) {}
  async create(createIllnessDto: CreateIllnessDto) {
    if (createIllnessDto.conditionId) {
      const conditions = await Promise.all(
        createIllnessDto.conditionId.map(async (conditionId) => {
          const condition = await this.conditionRepository.findOneById(
            conditionId,
          );
          if (!condition)
            throw new UnprocessableEntityException('Condition not found');
          return condition;
        }),
      );
      const illnessEntity = CreateIllnessDto.fromDto(createIllnessDto);
      illnessEntity.condition = conditions;
      const illness = await this.illnessRepository.create(illnessEntity);
      if (illness !== undefined) {
        console.log(illness);
        return illness;
      }
    }
  }

  async findAll() {
    const illnesses = await this.illnessRepository.findAll();
    return illnesses;
  }

  findOne(id: string) {
    return `This action returns a #${id} illness`;
  }

  async update(updateIllnessDto: UpdateIllnessDto): Promise<IllnessEntity> {
    const illness = await this.illnessRepository.findOneById(
      updateIllnessDto.id,
    );
    if (!illness) throw new UnprocessableEntityException('Register not found');
    const updated = await this.illnessRepository.updateOne(
      UpdateIllnessDto.fromDto(updateIllnessDto),
    );
    if (!updated.illnessid)
      throw new InternalServerErrorException('Unable to update register');

    return updated;
  }

  async delete(id: string): Promise<IllnessEntity> {
    const illness = this.findOne(id);
    if (!illness) throw new UnprocessableEntityException('Register not found');
    const removed = await this.illnessRepository.delete(id);
    if (!removed)
      throw new InternalServerErrorException('Unable to delete register');

    return;
  }
}
