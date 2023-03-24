import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { ContentSubmissionRepository } from 'src/repositories/content-submission.repository';
import { SquadUserRepository } from 'src/repositories/squad-user.repositoy';
import { KnowledgeSubmissionRepository } from '../../repositories/knowledge-submission.repository';
import { ContentSubmissionEntity } from '../content-submission/entities/content-submission.entity';
import { SquadUserEntity } from '../shared/entities/squad-user.entity';
import { KnowledgeSubmissionEntity } from './entities/knowledge-submission.entity';
import { KnowledgeSubmissionController } from './knowledge-submission.controller';
import { KnowledgeSubmissionService } from './knowledge-submission.service';

const knowledgeSubmissionRepository = {
  provide: 'KnowledgeSubmissionRepositoryInterface',
  useClass: KnowledgeSubmissionRepository,
};

const knowledgeSubmissionEntity = {
  provide: 'KnowledgeSubmissionEntity',
  useClass: KnowledgeSubmissionEntity,
};

const knowledgeSubmissionServiceInterface = {
  provide: 'KnowledgeSubmissionServiceInterface',
  useClass: KnowledgeSubmissionService,
};

const contentSubmissionRepositoryInterface = {
  provide: 'ContentSubmissionRepositoryInterface',
  useClass: ContentSubmissionRepository,
};

const squadUserRepository = {
  provide: 'SquadUserRepositoryInterface',
  useClass: SquadUserRepository,
};

const providers = [
  knowledgeSubmissionServiceInterface,
  knowledgeSubmissionRepository,
  contentSubmissionRepositoryInterface,
  knowledgeSubmissionEntity,
  squadUserRepository,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KnowledgeSubmissionEntity,
      ContentSubmissionEntity,
      SquadUserEntity,
    ]),
    JwtModule.register({ secret: configService.getJwtSecret() }),
  ],
  providers: [...providers],
  exports: [...providers],
  controllers: [KnowledgeSubmissionController],
})
export class KnowledgeSubmissionModule {}
