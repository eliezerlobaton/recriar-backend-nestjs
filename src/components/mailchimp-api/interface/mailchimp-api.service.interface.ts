export interface MailchimpApiServiceInterface {
  addMemberTags(subscriberEmail: string, tagNames: string[]): Promise<boolean>;
  addMemberTagsByCustomerId(
    customerId: string,
    tagNames: string[],
  ): Promise<boolean>;
  findSubscriberByCpf(cpf: string, tagNames: string[]): Promise<any>;
}
