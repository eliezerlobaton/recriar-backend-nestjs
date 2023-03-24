import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReminderDto {
  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  squadUserId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  reminder: string;
}
