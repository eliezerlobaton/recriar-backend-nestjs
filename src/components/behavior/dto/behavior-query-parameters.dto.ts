import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { BehaviorType } from '../enum/behavior-type.enum';

export class BehaviorQueryParametersDTO extends BaseQueryParametersDTO {
  @ApiProperty({ enum: BehaviorType, required: false })
  @IsOptional()
  @IsEnum(BehaviorType, {
    message: `BehaviorType value must be one of these: ${Object.values(
      BehaviorType,
    ).join()}`,
  })
  BehaviorType?: BehaviorType;
}
