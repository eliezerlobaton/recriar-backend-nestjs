import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseQueryParametersDTO } from '../../shared/dto/base-query-parameters.dto';

export class ContentFilterQueryDTO
  extends BaseQueryParametersDTO
  implements Partial<ContentFilterQueryDTO>
{
  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  KnowledgeId: string;
}
