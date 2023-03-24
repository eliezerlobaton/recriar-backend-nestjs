import { ApiProperty } from '@nestjs/swagger';
import { KnowledgeDTO } from './knowledge.dto';

export class KnowledgeSentDTO extends KnowledgeDTO {
  @ApiProperty()
  alreadySent: boolean;
}
