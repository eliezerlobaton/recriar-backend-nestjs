export class CreateRoomResponseDto {
  sid: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
  accountSid: string;
  enableTurn: boolean;
  uniqueName: string;
  statusCallback: string;
  statusCallbackMethod: string;
  endTime: any;
  duration: any;
  type: string;
  maxParticipants: number;
  maxParticipantDuration: number;
  maxConcurrentPublishedTracks: number;
  recordParticipantsOnConnect: boolean;
  videoCodecs: string[];
  mediaRegion: string;
  audioOnly: boolean;
  emptyRoomTimeout: number;
  unusedRoomTimeout: number;
  url: string;
  links: {
    recordings: string;
    participants: string;
    recording_rules: string;
  };
}
