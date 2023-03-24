import { TwilioRoomStatus } from '../api/enum/twilio-room-status.enum';
import { TwilioRoomType } from '../api/enum/twilio-room-types.enum';
import { TwilioStatusCallbackEvent } from '../api/enum/twilio-status-callback-event.enum';

export class StatusCallbackBodyDto {
  RoomStatus: TwilioRoomStatus;
  RoomType: TwilioRoomType;
  RoomSid: string;
  RoomName: string;
  SequenceNumber: number;
  StatusCallbackEvent: TwilioStatusCallbackEvent;
  Timestamp: string;
  AccountSid: string;
}
