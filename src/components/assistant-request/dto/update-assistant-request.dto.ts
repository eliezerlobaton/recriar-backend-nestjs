import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsDate } from 'class-validator';
import { AssistantRequestEntity } from '../entities/assistant-request.entity';
import { CreateAssistantRequestDto } from './create-assistant-request.dto';

export class UpdateAssistantRequestDto extends PartialType(CreateAssistantRequestDto) {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  assistantId: string;

  @ApiProperty()
  @IsUUID()
  responsibleId: string;

  @ApiProperty()
  @IsString()
  responsibleMessage: string;

  endDate?: Date;
}
