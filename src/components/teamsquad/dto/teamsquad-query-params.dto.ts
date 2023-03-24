import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

export class TeamSquadQueryParamsDto {
  @ApiProperty()
  @IsBooleanString()
  @IsOptional()
  WithDeleted?: boolean;
}
