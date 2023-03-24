import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { IllnessEntity } from '../entities/illness.entity';
import { CreateIllnessDto } from './create-illness.dto';

export class UpdateIllnessDto extends PartialType(CreateIllnessDto) {
  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  integrationId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  conditionId: string[];

  public static fromDto(dto: UpdateIllnessDto): Partial<IllnessEntity> {
    const illness: Partial<IllnessEntity> = {
      illnessid: dto.id,
      integrationid: dto.integrationId,
      description: dto.description,
      condition: <any>dto.conditionId,
    };
    return illness;
  }
}
