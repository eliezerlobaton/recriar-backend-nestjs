import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { KnowledgeSubmissionRepository } from 'src/repositories/knowledge-submission.repository';
import { SquadUserRepository } from 'src/repositories/squad-user.repositoy';
import { ContentSubmissionRepository } from '../../repositories/content-submission.repository';
import { ContentEntity } from '../content/entities/content.entity';
import { KnowledgeSubmissionEntity } from '../knowledge-submission/entities/knowledge-submission.entity';
import { SquadUserEntity } from '../shared/entities/squad-user.entity';
import { ContentSubmissionController } from './content-submission.controller';
import { ContentSubmissionService } from './content-submission.service';
import { ContentSubmissionEntity } from './entities/content-submission.entity';

const contentSubmissionRepository = {
  provide: 'ContentSubmissionRepositoryInterface',
  useClass: ContentSubmissionRepository,
};

const knowledgeSubmissionRepository = {
  provide: 'KnowledgeSubmissionRepositoryInterface',
  useClass: KnowledgeSubmissionRepository,
};

const contentSubmissionServiceInterface = {
  provide: 'ContentSubmissionServiceInterface',
  useClass: ContentSubmissionService,
};

const squadUserRepository = {
  provide: 'SquadUserRepositoryInterface',
  useClass: SquadUserRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContentSubmissionEntity,
      ContentEntity,
      SquadUserEntity,
      KnowledgeSubmissionEntity,
    ]),
    JwtModule.register({ secret: configService.getJwtSecret() }),
  ],
  controllers: [ContentSubmissionController],
  providers: [
    contentSubmissionRepository,
    contentSubmissionServiceInterface,
    squadUserRepository,
    knowledgeSubmissionRepository,
  ],
  exports: [contentSubmissionRepository],
})
export class ContentSubmissionModule {}
