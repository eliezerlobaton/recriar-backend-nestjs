import { Test, TestingModule } from '@nestjs/testing';
import { ContentSubmissionService } from './content-submission.service';

describe('ContentSubmissionService', () => {
  let service: ContentSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentSubmissionService],
    }).compile();

    service = module.get<ContentSubmissionService>(ContentSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
