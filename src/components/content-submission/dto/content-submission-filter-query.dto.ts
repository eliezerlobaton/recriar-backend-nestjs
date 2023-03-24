import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { BaseQueryParametersDTO } from '../../shared/dto/base-query-parameters.dto';
import { ContentSubmissionStatus } from '../../shared/dto/enums/common-enum';

export class ContentSubmissionFilterQueryDTO
  extends BaseQueryParametersDTO
  implements Partial<ContentSubmissionFilterQueryDTO>
{
  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  ContentId?: string;

  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  KnowledgeId?: string;

  @ApiProperty({ required: false, enum: ContentSubmissionStatus })
  @IsOptional()
  @IsEnum(ContentSubmissionStatus, {
    message: `Status value must be one of these: ${Object.values(
      ContentSubmissionStatus,
    ).join()}`,
  })
  Status?: ContentSubmissionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  IsFavorite?: boolean;

  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  KnowledgeObjectiveId?: string;
}
