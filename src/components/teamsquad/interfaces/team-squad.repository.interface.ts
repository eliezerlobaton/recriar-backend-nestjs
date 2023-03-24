import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { TeamSquadEntity } from '../entities/team-squad.entity';

export interface TeamSquadRepositoryInterface
  extends BaseInterfaceRepository<TeamSquadEntity> {
  isResponsible(responsibleId: string, customerId: string): Promise<boolean>;
}
