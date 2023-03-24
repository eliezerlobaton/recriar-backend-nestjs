import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateGuidanceDto } from './create-guidance.dto';

export class ResendGuidanceDTO extends CreateGuidanceDto {
  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
