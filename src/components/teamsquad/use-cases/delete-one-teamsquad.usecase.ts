import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { TeamSquadRepositoryInterface } from '../interfaces/team-squad.repository.interface';

@Injectable()
export class DeleteOneTeamSquadUseCase implements UseCase<any> {
  constructor(
    @Inject('TeamSquadRepositoryInterface')
    private readonly teamSquadRepository: TeamSquadRepositoryInterface,
  ) {}

  async execute(deleteTeamSquadDto: { id: string }) {
    return this.teamSquadRepository.delete(deleteTeamSquadDto.id);
  }
}
