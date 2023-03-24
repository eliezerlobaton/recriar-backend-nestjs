import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BehaviorType } from 'src/components/behavior/enum/behavior-type.enum';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { AppStatus } from 'src/components/shared/dto/enums/common-enum';

export class GuidanceQueryParametersDTO extends BaseQueryParametersDTO {
  @ApiProperty({ enum: AppStatus, required: false })
  @IsOptional()
  @IsEnum(AppStatus, {
    message: `Status value must be one of these: ${Object.values(
      AppStatus,
    ).join()}`,
  })
  Status?: AppStatus;

  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  BehaviorId?: string;

  @ApiProperty({ enum: BehaviorType, required: false })
  @IsOptional()
  @IsEnum(BehaviorType, {
    message: `BehaviorType value must be one of these: ${Object.values(
      BehaviorType,
    ).join()}`,
  })
  BehaviorType?: BehaviorType;
}
