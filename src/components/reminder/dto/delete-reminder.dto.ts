import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteReminderDto {
  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
