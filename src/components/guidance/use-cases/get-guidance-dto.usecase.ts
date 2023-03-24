import { Inject } from '@nestjs/common';
import { SquadUserRepositoryInterface } from 'src/components/shared/interfaces/squad-user.repository.interface';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { GuidanceDTO } from '../dto/guidance.dto';
import { GuidanceEntity } from '../entities/guidance.entity';
import { GuidanceMapper } from '../mappers/guidance.mapper';
import { GetSurveyResultsUseCase } from './get-survey-results.usecase';

export class GetGuidanceDtoUseCase implements UseCase<GuidanceDTO> {
  private readonly mapper: GuidanceMapper = new GuidanceMapper();
  constructor(
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    private readonly getSurveyResults: GetSurveyResultsUseCase,
  ) {}

  async execute(guidance: GuidanceEntity): Promise<GuidanceDTO> {
    if (guidance.customer.customerid === guidance.responsible)
      guidance.responsible = <any>{
        id: guidance.customer.customerid,
        name: guidance.customer.name,
      };
    else {
      const squadUser = await this.squadUserRepository.findOneById(
        guidance.responsible,
      );
      guidance.responsible = <any>{
        id: squadUser.squaduserid,
        name: squadUser.name,
      };
    }
    const guidanceDto = this.mapper.mapFrom(guidance);
    const surveyResults = await this.getSurveyResults.execute(
      guidance.behavior.integrationid,
      guidanceDto.result,
    );
    guidanceDto.surveyResults = surveyResults;
    return guidanceDto;
  }
}
