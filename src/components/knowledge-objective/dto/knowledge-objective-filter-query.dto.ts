import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryParametersDTO } from '../../shared/dto/base-query-parameters.dto';
import { KnowledgeType } from '../../shared/dto/enums/common-enum';

export class KnowledgeObjectiveFilterQueryDTO
  extends BaseQueryParametersDTO
  implements Partial<KnowledgeObjectiveFilterQueryDTO>
{
  @ApiProperty({ required: false, enum: KnowledgeType })
  @IsOptional()
  @IsEnum(KnowledgeType, {
    message: `KnowledgeType value must be one of these: ${Object.values(
      KnowledgeType,
    ).join()}`,
  })
  KnowledgeType: KnowledgeType;
}
