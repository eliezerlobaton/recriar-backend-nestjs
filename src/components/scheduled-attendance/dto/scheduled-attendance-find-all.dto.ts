import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { ScheduledAttendanceQueryParametersDto } from './scheduled-attendance-query-parameters.dto';

export class ScheduledAttendanceFindAllDto extends ScheduledAttendanceQueryParametersDto {
  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  CustomerId?: string;

  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  SquadUserId?: string;
}
