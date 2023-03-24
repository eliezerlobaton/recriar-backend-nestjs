import { Inject, Injectable } from '@nestjs/common';
import { BaseAbstractSurvey } from './base/base.abstract.survey';
import { GuidanceSurvyes } from '../enum/form.enum';
import { SurveyRepositoryInterface } from '../interfaces/survey.repository.interface';

@Injectable()
export class Phq9Survey extends BaseAbstractSurvey {
  constructor(
    @Inject('SurveyRepositoryInterface')
    readonly surveyRepository: SurveyRepositoryInterface,
  ) {
    super(surveyRepository, GuidanceSurvyes.Phq9);
  }
}
