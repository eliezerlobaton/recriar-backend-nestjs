import { PartialType } from '@nestjs/swagger';
import { CreateVideoConferenceDto } from './create-video-conference.dto';

export class UpdateVideoConferenceDto extends PartialType(
  CreateVideoConferenceDto,
) {}
