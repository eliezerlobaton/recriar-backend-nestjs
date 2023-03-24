import { Injectable } from '@nestjs/common';
import { CreateMailchimpCpfDto } from './dto/create-mailchimp-cpf.dto';
import { UpdateMailchimpCpfDto } from './dto/update-mailchimp-cpf.dto';

@Injectable()
export class MailchimpCpfService {
  create(createMailchimpCpfDto: CreateMailchimpCpfDto) {
    return 'This action adds a new mailchimpCpf';
  }

  findAll() {
    return `This action returns all mailchimpCpf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mailchimpCpf`;
  }

  update(id: number, updateMailchimpCpfDto: UpdateMailchimpCpfDto) {
    return `This action updates a #${id} mailchimpCpf`;
  }

  remove(id: number) {
    return `This action removes a #${id} mailchimpCpf`;
  }
}
