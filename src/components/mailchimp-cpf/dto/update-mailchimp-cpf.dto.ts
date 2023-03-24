import { PartialType } from '@nestjs/swagger';
import { CreateMailchimpCpfDto } from './create-mailchimp-cpf.dto';

export class UpdateMailchimpCpfDto extends PartialType(CreateMailchimpCpfDto) {}
