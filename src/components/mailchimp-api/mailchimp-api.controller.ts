import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FinalizeOnBoardingBody } from './dto/finalize-onboarding-body.dto';
import { FindSubscriberBody } from './dto/find-suscriber-body.dto';
import { tagName } from './enum/tag-name.enum';
import { MailchimpApiServiceInterface } from './interface/mailchimp-api.service.interface';

@ApiTags('IntegrationMailchimp')
@Controller('mailchimp-api')
export class MailchimpApiController {
  constructor(
    @Inject('MailchimpApiServiceInterface')
    private readonly mailchimpApiService: MailchimpApiServiceInterface,
  ) {}

  @Post('/finalizeOnBoarding')
  async finalizeOnBoarding(@Body() body: FinalizeOnBoardingBody) {
    return await this.mailchimpApiService.addMemberTagsByCustomerId(
      body.customerId,
      [tagName.finishedOnBoarding],
    );
  }

  @Post('/fisrtaccess')
  async firstAccess(@Body() body: FindSubscriberBody) {
    return await this.mailchimpApiService.findSubscriberByCpf(
      body.customerCpf,
      [tagName.firstAccess],
    );
  }
}
