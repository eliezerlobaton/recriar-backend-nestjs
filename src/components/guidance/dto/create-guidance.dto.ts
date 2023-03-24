import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { GuidanceEntity } from '../entities/guidance.entity';

export class CreateGuidanceDto {
  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  behaviorId: string;

  @ApiProperty({ format: 'uuid', required: true })
  @IsNotEmpty()
  @IsUUID()
  responsibleId: string;

  sentBy?: string;

  static fromDTO(dto: CreateGuidanceDto): Partial<GuidanceEntity> {
    const entity = new GuidanceEntity();
    entity.customer = <any>dto.customerId;
    entity.behavior = <any>dto.behaviorId;
    entity.responsible = dto.responsibleId;
    entity.sent_by = <any>dto.sentBy;
    return entity;
  }
}
