import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { configService } from 'src/config/config.service';
import { MailchimpApiServiceInterface } from './interface/mailchimp-api.service.interface';
import { TagBody } from '@mailchimp/mailchimp_marketing';
import * as MailchimpApi from '@mailchimp/mailchimp_marketing';
import { textToMD5Hash } from '../shared/lib/common-functions';
import { MailchimpApiError } from './dto/mailchimp-error.dto';
import { CustomerRepositoryInterface } from '../customer/interfaces/customer.repository.interface';

@Injectable()
export class MailchimpApiService implements MailchimpApiServiceInterface {
  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {
    MailchimpApi.setConfig({
      apiKey: configService.getMailchimpApiKey(),
      server: configService.getMailchimpServerPrefix(),
    });
  }

  async addMemberTagsByCustomerId(
    customerId: string,
    tagNames: string[],
  ): Promise<boolean> {
    const customer = await this.customerRepository.findOneById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    return this.addMemberTags(customer.email, tagNames);
  }

  async addMemberTags(
    subscriberEmail: string,
    tagNames: string[],
  ): Promise<boolean> {
    const newTags = tagNames.map(
      (tagName): TagBody => ({
        name: tagName,
        status: 'active',
      }),
    );

    const subscriberHash = textToMD5Hash(subscriberEmail);

    try {
      const response = await MailchimpApi.lists.updateListMemberTags(
        configService.getMailchimpAudienceId(),
        subscriberHash,
        { tags: newTags },
      );

      return response === null;
    } catch (error) {
      const errorMessage: MailchimpApiError = JSON.parse(
        error.response.res.text,
      );

      switch (errorMessage.status) {
        case 404:
          throw new NotFoundException(errorMessage.detail);
        case 401:
          throw new UnauthorizedException('Invalid api key and/or audience id');
        default:
          throw error;
      }
    }
  }
  async findSubscriberByCpf(cpf: string): Promise<boolean> {
    //verificar se o cpf existe no banco de dados do mailchimp
    const subscriberHash = textToMD5Hash(cpf);
    try {
      const response = await MailchimpApi.lists.getListMember(
        configService.getMailchimpAudienceId(),
        subscriberHash,
      );
      console.log(response);
      return response !== null;
    } catch (error) {
      const errorMessage: MailchimpApiError = JSON.parse(
        error.response.res.text,
      );

      switch (errorMessage.status) {
        case 404:
          return false;
        case 401:
          throw new UnauthorizedException('Invalid api key and/or audience id');
        default:
          throw error;
      }
    }
  }
}
