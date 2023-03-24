import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateReminderDto {
  @ApiProperty({ format: 'uuid', required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  reminder: string;
}
