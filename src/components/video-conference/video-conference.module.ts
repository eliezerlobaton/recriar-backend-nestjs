import { Module } from '@nestjs/common';
import { VideoConferenceService } from './video-conference.service';
import { VideoConferenceController } from './video-conference.controller';
import { TwilioApiService } from './api/twilio.api.service';

const videoApiService = {
  provide: 'VideoConferenceApiService',
  useClass: TwilioApiService,
};

@Module({
  controllers: [VideoConferenceController],
  providers: [VideoConferenceService, videoApiService],
  exports: [VideoConferenceService, videoApiService],
})
export class VideoConferenceModule {}
