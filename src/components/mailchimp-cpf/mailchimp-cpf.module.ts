import { Module } from '@nestjs/common';
import { MailchimpCpfService } from './mailchimp-cpf.service';
import { MailchimpCpfController } from './mailchimp-cpf.controller';

@Module({
  controllers: [MailchimpCpfController],
  providers: [MailchimpCpfService]
})
export class MailchimpCpfModule {}
