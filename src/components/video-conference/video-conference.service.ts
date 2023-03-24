import { Inject, Injectable, Logger } from '@nestjs/common';
import { TwilioRoomType } from './api/enum/twilio-room-types.enum';
import { CreateVideoConferenceDto } from './dto/create-video-conference.dto';
import { VideoConferenceApiInterface } from './interfaces/video-conference.api.interface';

@Injectable()
export class VideoConferenceService {
  constructor(
    @Inject('VideoConferenceApiService')
    private readonly videoApiService: VideoConferenceApiInterface<TwilioRoomType>,
  ) {}

  async create(createVideoConferenceDto: CreateVideoConferenceDto) {
    Logger.log(createVideoConferenceDto);
    return await this.videoApiService.createRoom(
      createVideoConferenceDto.name,
      TwilioRoomType.Group,
    );
  }

  async findAll() {
    return await this.videoApiService.getAllRoons();
  }

  async findOne(roomUrl: string) {
    return await this.videoApiService.getOneRoom(roomUrl);
  }

  async completeOne(roomUrl: string) {
    return await this.videoApiService.completeRoom(roomUrl);
  }
}
