import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { LimesurveyResponseEntity } from '../entities/limesurvey-response.entity';

export type LimeSurveyResponseRepositoryInterface =
  BaseInterfaceRepository<LimesurveyResponseEntity>;
