import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailchimpCpfService } from './mailchimp-cpf.service';
import { CreateMailchimpCpfDto } from './dto/create-mailchimp-cpf.dto';
import { UpdateMailchimpCpfDto } from './dto/update-mailchimp-cpf.dto';

@Controller('mailchimp-cpf')
export class MailchimpCpfController {
  constructor(private readonly mailchimpCpfService: MailchimpCpfService) {}

  @Post()
  create(@Body() createMailchimpCpfDto: CreateMailchimpCpfDto) {
    return this.mailchimpCpfService.create(createMailchimpCpfDto);
  }

  @Get()
  findAll() {
    return this.mailchimpCpfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailchimpCpfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailchimpCpfDto: UpdateMailchimpCpfDto) {
    return this.mailchimpCpfService.update(+id, updateMailchimpCpfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailchimpCpfService.remove(+id);
  }
}
