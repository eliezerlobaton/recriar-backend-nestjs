import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ResendKnowledgeSubmissionDTO {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsJWT()
  squadUserToken?: string;
}
