import { Module } from '@nestjs/common';
import { TeamsquadController } from './teamsquad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamSquadEntity } from './entities/team-squad.entity';
import { TeamSquadRepository } from 'src/repositories/team-squad.repository';
import { DatabaseModule } from 'src/database/database.module';
import { GetAllTeamSquadsUseCase } from './use-cases/get-all-teamsquads.usecase';
import { DeleteOneTeamSquadUseCase } from './use-cases/delete-one-teamsquad.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([TeamSquadEntity]), DatabaseModule],
  controllers: [TeamsquadController],
  providers: [
    { provide: 'TeamSquadRepositoryInterface', useClass: TeamSquadRepository },
    GetAllTeamSquadsUseCase,
    DeleteOneTeamSquadUseCase,
  ],
})
export class TeamsquadModule {}
