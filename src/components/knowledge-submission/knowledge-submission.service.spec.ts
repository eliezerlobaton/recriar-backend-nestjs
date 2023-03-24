import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeSubmissionService } from './knowledge-submission.service';

describe('KnowledgeSubmissionService', () => {
  let service: KnowledgeSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeSubmissionService],
    }).compile();

    service = module.get<KnowledgeSubmissionService>(
      KnowledgeSubmissionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
