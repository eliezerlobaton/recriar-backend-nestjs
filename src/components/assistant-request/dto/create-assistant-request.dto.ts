import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { AssistantRequestEntity } from '../entities/assistant-request.entity';

export class CreateAssistantRequestDto {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  assistantId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  responsibleId?: string;

  @ApiProperty()
  @IsString()
  responsibleMessage: string;

  sentBy?: string;

  public static fromDTO(
    dto: CreateAssistantRequestDto,
  ): AssistantRequestEntity {
    const entity = new AssistantRequestEntity();
    entity.customer = <any>dto.customerId;
    entity.assistant = <any>dto.assistantId;
    entity.responsible = <any>dto.responsibleId;
    entity.responsible_message = dto.responsibleMessage;
    return entity;
  }
}
