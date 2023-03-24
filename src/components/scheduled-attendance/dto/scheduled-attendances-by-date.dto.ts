import { ScheduledAttendanceDto } from './scheduled-attendance.dto';

export class ScheduledAttendancesByDateDto {
  date: string;
  attendances: ScheduledAttendanceDto[];
}
