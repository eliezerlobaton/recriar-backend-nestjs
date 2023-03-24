import { Logger } from '@nestjs/common';
import { ScheduledAttendanceEntity } from '../entities/scheduled-attendance.entity';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';

export class CreateScheduledAttendanceDto {
  squadUserId: string;
  name: string;
  customerId: string;
  reason: string;
  status: ScheduledAttendanceStatus;
  startDate: Date;
  endDate: Date;

  public static fromDto(
    dto: CreateScheduledAttendanceDto,
  ): Partial<ScheduledAttendanceEntity> {
    Logger.log(JSON.stringify(dto));
    return {
      squaduser: <any>dto.squadUserId,
      customer: <any>dto.customerId,
      name: dto.name,
      reason: dto.reason,
      status: ScheduledAttendanceStatus.Active,
      start_date: dto.startDate,
      end_date: dto.endDate,
      event_uri: '',
      event_type: '',
    };
  }
}
