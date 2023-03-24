import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';

export class ScheduledAttendanceQueryParametersDto extends BaseQueryParametersDTO {
  @ApiProperty({ enum: ScheduledAttendanceStatus, required: false })
  @IsOptional()
  @IsEnum(ScheduledAttendanceStatus, {
    message: `ScheduledAttendanceStatus value must be one of these: ${Object.values(
      ScheduledAttendanceStatus,
    ).join()}`,
  })
  Status: ScheduledAttendanceStatus;
}
