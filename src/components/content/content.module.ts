import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentSubmissionRepository } from 'src/repositories/content-submission.repository';
import { ContentRepository } from 'src/repositories/content.repository';
import { KnowledgeRepository } from 'src/repositories/knowledge.repository';
import { ContentSubmissionEntity } from '../content-submission/entities/content-submission.entity';
import { KnowledgeEntity } from '../knowledge/entities/knowledge.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentEntity } from './entities/content.entity';

const ContentServiceInterface = {
  provide: 'ContentServiceInterface',
  useClass: ContentService,
};

const contentRepositoryInterface = {
  provide: 'ContentRepositoryInterface',
  useClass: ContentRepository,
};

const knowledgeRepositoryInterface = {
  provide: 'KnowledgeRepositoryInterface',
  useClass: KnowledgeRepository,
};

const contentSubmissionRepositoryInterface = {
  provide: 'ContentSubmissionRepositoryInterface',
  useClass: ContentSubmissionRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContentEntity,
      ContentSubmissionEntity,
      KnowledgeEntity,
    ]),
  ],
  providers: [
    ContentServiceInterface,
    contentRepositoryInterface,
    contentSubmissionRepositoryInterface,
    knowledgeRepositoryInterface,
  ],
  controllers: [ContentController],
})
export class ContentModule {}
