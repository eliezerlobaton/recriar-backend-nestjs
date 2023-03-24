import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { SquadUserEntity } from '../entities/squad-user.entity';

export type SquadUserRepositoryInterface =
  BaseInterfaceRepository<SquadUserEntity>;
