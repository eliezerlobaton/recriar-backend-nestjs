import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AppStatus } from 'src/components/shared/dto/enums/common-enum';
import { GuidanceEntity } from '../entities/guidance.entity';

export class UpdateGuidanceDto {
  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ enum: AppStatus, required: true })
  @IsNotEmpty()
  @IsEnum(AppStatus, {
    message: `Status value must be one of these: ${Object.values(
      AppStatus,
    ).join()}`,
  })
  status: AppStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  answer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  reponsibleId?: string;

  static fromDTO(dto: UpdateGuidanceDto): Partial<GuidanceEntity> {
    const entity = new GuidanceEntity();
    const { id, status } = dto;
    entity.guidanceid = id;
    entity.status = status;
    if (dto.reponsibleId) entity.responsible = dto.reponsibleId;
    return entity;
  }
}
