import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyEntity } from 'src/components/survey/entities/survey.entity';
import { SurveyRepositoryInterface } from 'src/components/survey/interfaces/survey.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class SurveyRepository
  extends BaseAbstractRepository<SurveyEntity>
  implements SurveyRepositoryInterface
{
  constructor(
    @InjectRepository(SurveyEntity)
    private readonly surveyRepository: Repository<SurveyEntity>,
  ) {
    super(surveyRepository);
  }
}
