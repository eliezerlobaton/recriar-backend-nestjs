import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { DatabaseService } from 'src/database/database.service';
import { TeamSquadQueryParamsDto } from '../dto/teamsquad-query-params.dto';
import { TeamSquadEntity } from '../entities/team-squad.entity';

@Injectable()
export class GetAllTeamSquadsUseCase implements UseCase<any> {
  constructor(private readonly dbService: DatabaseService) {}
  async execute(queryParams: TeamSquadQueryParamsDto) {
    const queryBuilder = this.dbService
      .getDbHandle()
      .createQueryBuilder()
      .select()
      .from(TeamSquadEntity, 'ts');
    console.log(typeof queryParams.WithDeleted);

    if (queryParams.WithDeleted === <any>'true') queryBuilder.withDeleted();
    return queryBuilder.getRawMany();
  }
}
