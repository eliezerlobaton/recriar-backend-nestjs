import { ScheduledAttendanceDto } from 'src/components/scheduled-attendance/dto/scheduled-attendance.dto';
import { ScheduledAttendanceEntity } from 'src/components/scheduled-attendance/entities/scheduled-attendance.entity';
import { Mapper } from 'src/components/shared/mappers/mapper';

export class AttendanceMapper extends Mapper<
  ScheduledAttendanceEntity,
  ScheduledAttendanceDto
> {
  public mapFrom(data: ScheduledAttendanceEntity): ScheduledAttendanceDto {
    const attendance = new ScheduledAttendanceDto();

    attendance.id = data.scheduled_attendanceid;
    attendance.eventUri = data.event_uri;
    attendance.name = data.name;
    attendance.squadUser = <any>{
      id: data.squaduser.squaduserid,
      name: data.squaduser.name,
      role: data.squaduser.role,
      image: data.squaduser.image,
    };
    attendance.customer = data.customer
      ? {
          id: data.customer.customerid,
          name: data.customer.name,
        }
      : { id: null, name: null };
    attendance.attendanceUrl = data.attendance_url;
    attendance.reason = data.reason;
    attendance.status = data.status;
    attendance.startDate = data.start_date.toISOString();
    attendance.endDate = data.end_date.toISOString();
    attendance.hasParticipants = false;
    attendance.isRoomReady = false;

    return attendance;
  }

  public mapTo(data: ScheduledAttendanceDto): ScheduledAttendanceEntity {
    const attendance = new ScheduledAttendanceEntity();

    attendance.scheduled_attendanceid = data.id;
    attendance.event_uri = data.eventUri;
    attendance.name = data.name;
    attendance.squaduser = <any>data.squadUser.id;
    attendance.customer = <any>data.customer.id;
    attendance.attendance_url = data.attendanceUrl;
    attendance.reason = data.reason;
    attendance.status = data.status;
    attendance.start_date = new Date(data.startDate);
    attendance.end_date = new Date(data.endDate);

    return attendance;
  }
}
