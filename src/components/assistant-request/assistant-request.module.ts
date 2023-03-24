import { Module } from '@nestjs/common';
import { AssistantRequestService } from './assistant-request.service';
import { AssistantRequestController } from './assistant-request.controller';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { AssistantRequestEntity } from './entities/assistant-request.entity';
import { SquadUserEntity } from '../shared/entities/squad-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamSquadEntity } from '../teamsquad/entities/team-squad.entity';
import { AssistantRequestRepository } from 'src/repositories/assistant-request.repository';
import { TeamSquadRepository } from 'src/repositories/team-squad.repository';
import { SquadUserRepository } from 'src/repositories/squad-user.repositoy';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/config/config.service';

const assistantRequestRepository = {
  provide: 'AssistantRequestRepositoryInterface',
  useClass: AssistantRequestRepository,
};

const assistantRequestServiceInterface = {
  provide: 'AssistantRequestServiceInterface',
  useClass: AssistantRequestService,
};

const teamSquadRepositoryInterface = {
  provide: 'TeamSquadRepositoryInterface',
  useClass: TeamSquadRepository,
};

const squadUserRepositoryInterface = {
  provide: 'SquadUserRepositoryInterface',
  useClass: SquadUserRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssistantRequestEntity,
      CustomerEntity,
      SquadUserEntity,
      TeamSquadEntity,
    ]),
    JwtModule.register({ secret: configService.getJwtSecret() }),
  ],
  controllers: [AssistantRequestController],
  providers: [
    assistantRequestRepository,
    assistantRequestServiceInterface,
    teamSquadRepositoryInterface,
    squadUserRepositoryInterface,
  ],
  exports: ['AssistantRequestRepositoryInterface'],
})
export class AssistantRequestModule {}
