import { InjectRepository } from '@nestjs/typeorm';
import { TeamSquadEntity } from 'src/components/teamsquad/entities/team-squad.entity';
import { TeamSquadRepositoryInterface } from 'src/components/teamsquad/interfaces/team-squad.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

export class TeamSquadRepository
  extends BaseAbstractRepository<TeamSquadEntity>
  implements TeamSquadRepositoryInterface
{
  constructor(
    @InjectRepository(TeamSquadEntity)
    private readonly teamSquadRepository: Repository<TeamSquadEntity>,
  ) {
    super(teamSquadRepository);
  }
  async isResponsible(
    responsibleId: string,
    customerId: string,
  ): Promise<boolean> {
    const found = await this.teamSquadRepository.findOne({
      where: {
        customerid: customerId,
        squaduserid: responsibleId,
        isresponsible: true,
      },
    });
    return typeof found !== 'undefined';
  }
}
