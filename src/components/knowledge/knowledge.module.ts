import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeSubmissionRepository } from '../../repositories/knowledge-submission.repository';
import { KnowledgeRepository } from '../../repositories/knowledge.repository';
import { KnowledgeSubmissionEntity } from '../knowledge-submission/entities/knowledge-submission.entity';
import { KnowledgeSubmissionModule } from '../knowledge-submission/knowledge-submission.module';
import { KnowledgeEntity } from './entities/knowledge.entity';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';

const knowledgeRepository = {
  provide: 'KnowledgeRepositoryInterface',
  useClass: KnowledgeRepository,
};

const knowledgeSubmissionRepository = {
  provide: 'KnowledgeSubmissionRepositoryInterface',
  useClass: KnowledgeSubmissionRepository,
};

const knowledgeService = {
  provide: 'KnowledgeServiceInterface',
  useClass: KnowledgeService,
};

const knowledgeEntity = {
  provide: 'KnowledgeEntity',
  useClass: KnowledgeEntity,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([KnowledgeEntity, KnowledgeSubmissionEntity]),
    KnowledgeSubmissionModule,
  ],
  providers: [
    knowledgeService,
    knowledgeRepository,
    knowledgeSubmissionRepository,
    knowledgeEntity,
  ],
  controllers: [KnowledgeController],
  exports: [knowledgeRepository, knowledgeEntity],
})
export class KnowledgeModule {}
