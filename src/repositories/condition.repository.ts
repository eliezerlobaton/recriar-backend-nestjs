import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConditionEntity } from 'src/components/shared/entities/condition.entity';
import { Repository } from 'typeorm';

import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class ConditionRepository extends BaseAbstractRepository<ConditionEntity> {
  constructor(
    @InjectRepository(ConditionEntity)
    private readonly conditionRepository: Repository<ConditionEntity>,
  ) {
    super(conditionRepository);
  }
}
