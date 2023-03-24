import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParametersDTO } from './base-query-parameters.dto';
import { KnowledgeSubmissionStatus } from './enums/common-enum';

export class KnowledgeFilterQueryDTO
  extends BaseQueryParametersDTO
  implements Partial<KnowledgeFilterQueryDTO>
{
  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  KnowledgeId: string;

  @ApiProperty({ required: false, enum: KnowledgeSubmissionStatus })
  @IsOptional()
  @IsEnum(KnowledgeSubmissionStatus, {
    message: `Status value must be one of these: ${Object.values(
      KnowledgeSubmissionStatus,
    ).join()}`,
  })
  Status: KnowledgeSubmissionStatus;

  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  KnowledgeObjectiveId?: string;
}
