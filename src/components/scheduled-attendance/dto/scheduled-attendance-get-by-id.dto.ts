import { RoomDTO } from 'src/components/video-conference/dto/room.dto';
import { ScheduledAttendanceEntity } from '../entities/scheduled-attendance.entity';
import { ScheduledAttendanceDto } from './scheduled-attendance.dto';

export class ScheduledAttendanceWithRoomDto extends ScheduledAttendanceDto {
  room: RoomDTO;
  token?: string;

  public static fromEntityAndRoomInstance(
    entity: ScheduledAttendanceEntity,
    room: RoomDTO,
  ): ScheduledAttendanceWithRoomDto {
    const dto = ScheduledAttendanceDto.fromEntity(entity);
    return Object.assign(dto, {
      room: room,
    });
  }
}
