import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BehaviorEntity } from '../entities/behavior.entity';
import { CreateBehaviorDTO } from './create-behavior.dto';

export class UpdateBehaviorDTO extends CreateBehaviorDTO {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  public static fromDTO(dto: UpdateBehaviorDTO): BehaviorEntity {
    const entity = super.fromDTO(dto);
    entity.behaviorid = dto.id;
    return entity;
  }
}
