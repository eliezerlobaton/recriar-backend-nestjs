import { Controller, Get, Body, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAllTeamSquadsUseCase } from './use-cases/get-all-teamsquads.usecase';
import { DeleteOneTeamSquadUseCase } from './use-cases/delete-one-teamsquad.usecase';
import { TeamSquadQueryParamsDto } from './dto/teamsquad-query-params.dto';

@ApiTags('TeamSquad')
@Controller('teamsquad')
export class TeamsquadController {
  constructor(
    private readonly getAllUseCase: GetAllTeamSquadsUseCase,
    private readonly deleteOneUseCase: DeleteOneTeamSquadUseCase,
  ) {}

  @Get()
  findAll(@Query() queryParams: TeamSquadQueryParamsDto) {
    return this.getAllUseCase.execute(queryParams);
  }

  @Delete()
  remove(@Body() deleteTeamSquadDto: { id: string }) {
    return this.deleteOneUseCase.execute(deleteTeamSquadDto);
  }
}
