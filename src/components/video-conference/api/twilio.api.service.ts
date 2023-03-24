import { Injectable } from '@nestjs/common';
import { RoomDTO } from '../dto/room.dto';
import { VideoConferenceApiInterface } from '../interfaces/video-conference.api.interface';
import { TwilioRoomType } from './enum/twilio-room-types.enum';
import { configService } from 'src/config/config.service';
import { Twilio, jwt } from 'twilio';
import { TwilioRoomStatus } from './enum/twilio-room-status.enum';

@Injectable()
export class TwilioApiService
  implements VideoConferenceApiInterface<TwilioRoomType>
{
  private readonly client: Twilio;
  constructor() {
    this.client = new Twilio(
      configService.getTwilioApiKey(),
      configService.getTwilioApiSecret(),
      { accountSid: configService.getTwilioAccountSid() },
    );
  }

  generateAuthToken(
    roomName: string,
    identity: string,
  ): { identity: string; token: string } {
    const token = new jwt.AccessToken(
      configService.getTwilioAccountSid(),
      configService.getTwilioApiKey(),
      configService.getTwilioApiSecret(),
    );

    token.identity = identity;

    const grant = new jwt.AccessToken.VideoGrant({
      room: roomName,
    });

    token.addGrant(grant);

    return {
      identity: identity,
      token: token.toJwt(),
    };
  }

  async getAllRoons(): Promise<RoomDTO[]> {
    return (await this.client.video.rooms.list()).map((room) =>
      RoomDTO.fromResponse(room),
    );
  }

  async createRoom(
    uniqueName: string,
    type?: TwilioRoomType,
  ): Promise<RoomDTO> {
    const roomInstance = await this.client.video.rooms.create({
      recordParticipantsOnConnect: true,
      uniqueName: uniqueName,
      type,
      statusCallback: configService.getTwilioStatusCallbackUrl(),
      statusCallbackMethod: configService.getTwilioStatusCallbackMethod(),
      emptyRoomTimeout: 10,
      unusedRoomTimeout: 10,
    });
    return RoomDTO.fromResponse(roomInstance);
  }

  private getRoomSidFromUrl(roomUrl: string): string {
    return roomUrl.split('/').pop();
  }

  async completeRoom(roomUrl: string): Promise<RoomDTO> {
    const updatedRoomInstance = await this.client.video
      .rooms(this.getRoomSidFromUrl(roomUrl))
      .update({ status: TwilioRoomStatus.Completed });
    return RoomDTO.fromResponse(updatedRoomInstance);
  }

  async getOneRoom(roomUrl: string): Promise<RoomDTO> {
    const roomInstance = await this.client.video
      .rooms(this.getRoomSidFromUrl(roomUrl))
      .fetch();
    return RoomDTO.fromResponse(roomInstance);
  }
}
