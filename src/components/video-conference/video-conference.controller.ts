import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  Req,
} from '@nestjs/common';
import { VideoConferenceService } from './video-conference.service';
import { CreateVideoConferenceDto } from './dto/create-video-conference.dto';

@Controller('video-conference')
export class VideoConferenceController {
  constructor(
    private readonly videoConferenceService: VideoConferenceService,
  ) {}

  @Post('/room')
  async create(@Body() createVideoConferenceDto: CreateVideoConferenceDto) {
    const room = await this.videoConferenceService.create(
      createVideoConferenceDto,
    );
    return JSON.stringify(room);
  }

  @Get('/room')
  async findAll() {
    const roons = await this.videoConferenceService.findAll();
    return JSON.stringify(roons);
  }

  @Get('/room/:roomUrl')
  async findOne(@Param('roomUrl') roomUrl: string) {
    const room = await this.videoConferenceService.findOne(roomUrl);
    return JSON.stringify(room);
  }

  @Post('/room/complete')
  async completeOne(@Body() completeRoomDTO: { roomUrl: string }) {
    const completedRoom = await this.videoConferenceService.completeOne(
      completeRoomDTO.roomUrl,
    );
    return JSON.stringify(completedRoom);
  }
}
