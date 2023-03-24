import { RoomDTO } from '../dto/room.dto';

export interface VideoConferenceApiInterface<TypeEnum> {
  createRoom(uniqueName: string, type?: TypeEnum): Promise<RoomDTO>;
  completeRoom(roomUrl: string): Promise<RoomDTO>;
  getOneRoom(roomUrl: string): Promise<RoomDTO>;
  getAllRoons(): Promise<RoomDTO[]>;
  generateAuthToken(
    roomName: string,
    identity: string,
  ): { identity: string; token: string };
}
