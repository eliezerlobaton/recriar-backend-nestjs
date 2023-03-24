import { InjectRepository } from '@nestjs/typeorm';
import { SquadUserEntity } from 'src/components/shared/entities/squad-user.entity';
import { SquadUserRepositoryInterface } from 'src/components/shared/interfaces/squad-user.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

export class SquadUserRepository
  extends BaseAbstractRepository<SquadUserEntity>
  implements SquadUserRepositoryInterface
{
  constructor(
    @InjectRepository(SquadUserEntity)
    private readonly squadUserRepository: Repository<SquadUserEntity>,
  ) {
    super(squadUserRepository);
  }
}
