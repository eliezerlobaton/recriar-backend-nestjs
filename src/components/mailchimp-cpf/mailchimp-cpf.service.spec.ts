import { Test, TestingModule } from '@nestjs/testing';
import { MailchimpCpfService } from './mailchimp-cpf.service';

describe('MailchimpCpfService', () => {
  let service: MailchimpCpfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailchimpCpfService],
    }).compile();

    service = module.get<MailchimpCpfService>(MailchimpCpfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
