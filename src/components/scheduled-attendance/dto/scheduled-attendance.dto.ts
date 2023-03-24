import { ScheduledAttendanceEntity } from '../entities/scheduled-attendance.entity';
import { FirebaseAttendanceDto } from './firebase-attendance.dto';

export class ScheduledAttendanceDto extends FirebaseAttendanceDto {
  id: string;
  eventUri: string;
  name: string;
  squadUser: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    name: string;
  };
  attendanceUrl?: string;
  reason: string;
  status: string;
  startDate: string;
  endDate: string;

  /**
   * fromEntity
   */
  public static fromEntity(
    entity: ScheduledAttendanceEntity,
  ): ScheduledAttendanceDto {
    const dto = {
      id: entity.scheduled_attendanceid,
      eventUri: entity.event_uri,
      name: entity.name,
      squadUser: {
        id: entity.squaduser.squaduserid,
        name: entity.squaduser.name,
        role: entity.squaduser.role,
        image: entity.squaduser.image,
      },
      customer: {
        id: entity.customer.customerid,
        name: entity.customer.name,
      },
      attendanceUrl: entity.attendance_url,
      reason: entity.reason,
      status: entity.status,
      startDate: entity.start_date.toISOString(),
      endDate: entity.end_date.toISOString(),
      hasParticipants: false,
      isRoomReady: false,
    };
    return dto;
  }
}
