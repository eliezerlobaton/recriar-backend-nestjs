import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeObjectiveService } from './knowledge-objective.service';

describe('KnowledgeObjectiveService', () => {
  let service: KnowledgeObjectiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeObjectiveService],
    }).compile();

    service = module.get<KnowledgeObjectiveService>(KnowledgeObjectiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
