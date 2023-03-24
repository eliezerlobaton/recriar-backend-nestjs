import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FinishAssistanceDTO {
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

  sentBy?: string;
}
