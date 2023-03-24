import { Inject, Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { TwilioStatusCallbackEvent } from 'src/components/video-conference/api/enum/twilio-status-callback-event.enum';
import { StatusCallbackBodyDto } from 'src/components/video-conference/dto/status-callback-body.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';

@Injectable()
export class HandleRoomUpdates {
  private db: Database;
  private dbRef: Reference;
  private participants: boolean[] = [];
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly scheduledAttendanceRepository: ScheduledAttendanceRepositoryInterface,
    private readonly firebase: FirebaseService,
  ) {
    this.db = this.firebase.dataBase;
    this.db.goOnline();
    this.dbRef = this.db.ref(`attendances`);
  }

  private async updateAttendaceRegister(
    scheduledAttendanceId: string,
    attribute: string,
    value: boolean,
  ): Promise<boolean> {
    const { scheduled_attendanceid, squaduser } =
      await this.scheduledAttendanceRepository.findOneByIdWithRelations(
        scheduledAttendanceId,
      );
    try {
      await this.dbRef
        .child(
          `${squaduser.squaduserid}/${scheduled_attendanceid}/${attribute}`,
        )
        .set(value);
      return true;
    } catch (error) {
      Logger.error(error);
    }
    return false;
  }

  private async roomCreated(scheduledAttendanceId: string): Promise<boolean> {
    return this.updateAttendaceRegister(
      scheduledAttendanceId,
      'isRoomReady',
      true,
    );
  }

  private async participantConnected(
    scheduledAttendanceId: string,
  ): Promise<boolean> {
    this.participants.push(true);
    return this.updateAttendaceRegister(
      scheduledAttendanceId,
      'hasParticipants',
      true,
    );
  }

  private async participantDisconected(
    scheduledAttendanceId: string,
  ): Promise<boolean> {
    this.participants.shift();
    return this.updateAttendaceRegister(
      scheduledAttendanceId,
      'hasParticipants',
      this.participants.length ? true : false,
    );
  }

  private async roomEnded(scheduledAttendanceId: string): Promise<boolean> {
    return this.updateAttendaceRegister(
      scheduledAttendanceId,
      'isRoomReady',
      false,
    );
  }

  async run(roomUpdateDto: StatusCallbackBodyDto): Promise<boolean> {
    if (
      roomUpdateDto.StatusCallbackEvent ===
      TwilioStatusCallbackEvent.RoomCreated
    ) {
      Logger.log(':::::::::::::::::', 'ROOM-CREATED');
      return await this.roomCreated(roomUpdateDto.RoomName);
    }
    if (
      roomUpdateDto.StatusCallbackEvent ===
      TwilioStatusCallbackEvent.ParticipantConnected
    ) {
      return await this.participantConnected(roomUpdateDto.RoomName);
    }
    if (
      roomUpdateDto.StatusCallbackEvent ===
      TwilioStatusCallbackEvent.ParticipantDisconnected
    ) {
      return await this.participantDisconected(roomUpdateDto.RoomName);
    }

    if (
      roomUpdateDto.StatusCallbackEvent === TwilioStatusCallbackEvent.RoomEnded
    ) {
      return await this.roomEnded(roomUpdateDto.RoomName);
    }
    return false;
  }
}
