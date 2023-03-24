import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepositoryInterface } from 'src/components/customer/interfaces/customer.repository.interface';
import { LimesurveyResponseEntity } from 'src/components/limesurvey-response/entities/limesurvey-response.entity';
import { LimesurveyResponseRepositoryInterface } from 'src/components/limesurvey-response/interfaces/limesurvey-response.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class LimesurveyResponseRepository
  extends BaseAbstractRepository<LimesurveyResponseEntity>
  implements LimesurveyResponseRepositoryInterface
{
  constructor(
    @InjectRepository(LimesurveyResponseEntity)
    private readonly limesurveyResponseRepository: Repository<LimesurveyResponseEntity>,
  ) {
    super(limesurveyResponseRepository);
  }
}
