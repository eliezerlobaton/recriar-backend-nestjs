import { Test, TestingModule } from '@nestjs/testing';
import { MailchimpCpfController } from './mailchimp-cpf.controller';
import { MailchimpCpfService } from './mailchimp-cpf.service';

describe('MailchimpCpfController', () => {
  let controller: MailchimpCpfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailchimpCpfController],
      providers: [MailchimpCpfService],
    }).compile();

    controller = module.get<MailchimpCpfController>(MailchimpCpfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
