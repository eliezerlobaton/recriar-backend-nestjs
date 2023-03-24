import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class NewKnowledgeSubmissionDTO {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  knowledgeId: string;

  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  knowledgeObjectiveId?: string;

  @IsOptional()
  @IsJWT()
  squadUserToken?: string;
}
