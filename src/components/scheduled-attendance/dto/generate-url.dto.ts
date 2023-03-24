import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GenerateUrlDto {
  @ApiProperty({ format: 'uuid', required: false })
  @IsUUID()
  @IsNotEmpty()
  squadUserId: string;

  @ApiProperty({ format: 'uuid', required: false })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;
}
