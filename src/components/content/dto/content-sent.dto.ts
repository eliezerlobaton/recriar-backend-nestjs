import { ApiProperty } from '@nestjs/swagger';
import { ContentDTO } from './content.dto';

export class ContentSentDTO extends ContentDTO {
  @ApiProperty()
  alreadySent: boolean;
}
