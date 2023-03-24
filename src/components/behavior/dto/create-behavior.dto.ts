import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BehaviorEntity } from '../entities/behavior.entity';
import { BehaviorType } from '../enum/behavior-type.enum';

export class CreateBehaviorDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  integrationId: string;

  @ApiProperty({ enum: BehaviorType })
  @IsOptional()
  @IsEnum(BehaviorType, {
    message: `Status value must be one of these: ${Object.values(
      BehaviorType,
    ).join()}`,
  })
  behaviorType?: BehaviorType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  formLink: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  activityText?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  automaticSend: boolean;
  /**
   * fromDTO
   */
  public static fromDTO(dto: CreateBehaviorDTO): BehaviorEntity {
    const entity = new BehaviorEntity();
    entity.integrationid = dto.integrationId;
    entity.description = dto.description;
    if (dto?.behaviorType) entity.behavior_type = dto.behaviorType;
    entity.link = dto.formLink;
    entity.activity_text = dto.activityText;
    entity.automatic_send = dto.automaticSend;
    return entity;
  }
}
