import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { IllnessEntity } from '../entities/illness.entity';

export class CreateIllnessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  integrationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  conditionId: string[];

  public static fromDto(dto: CreateIllnessDto): Partial<IllnessEntity> {
    const illness: Partial<IllnessEntity> = {
      integrationid: dto.integrationId,
      description: dto.description,
      condition: <any>dto.conditionId,
    };
    return illness;
  }
}
