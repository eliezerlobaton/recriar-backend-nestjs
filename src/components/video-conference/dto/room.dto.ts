import { RoomInstance } from 'twilio/lib/rest/video/v1/room';

export class RoomDTO {
  name: string;
  sid: string;
  url: string;
  status: string;

  public static fromResponse(response: RoomInstance): RoomDTO {
    return {
      name: response.uniqueName,
      sid: response.sid,
      url: response.url,
      status: response.status,
    };
  }

  constructor() {
    this.name = null;
    this.sid = null;
    this.status = null;
    this.url = null;
  }
}
