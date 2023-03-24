import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LimesurveyResponseEntity } from 'src/components/shared/entities/limesurvey-response.entity';
import { LimeSurveyResponseRepositoryInterface } from 'src/components/shared/interfaces/lime-survey-reponse.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class LimeSurveyResponseRepository
  extends BaseAbstractRepository<LimesurveyResponseEntity>
  implements LimeSurveyResponseRepositoryInterface
{
  constructor(
    @InjectRepository(LimesurveyResponseEntity)
    private readonly limeSurveyRepository: Repository<LimesurveyResponseEntity>,
  ) {
    super(limeSurveyRepository);
  }
}
