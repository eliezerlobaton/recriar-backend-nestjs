import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { KnowledgeDTO } from 'src/components/knowledge/dto/knowledge.dto';
import { ContentType } from '../../shared/dto/enums/common-enum';

export class ContentDTO {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ type: 'string' })
  title: string;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiProperty()
  readingTime: number;

  @Expose()
  @ApiProperty()
  body: string;

  @Expose()
  @ApiProperty({ enum: ContentType })
  contentType: ContentType;

  @Expose()
  @ApiProperty()
  contentComplexity: string;

  @Expose()
  @ApiProperty()
  knowledges: KnowledgeDTO[] | undefined;

  constructor(properties: Partial<ContentDTO>) {
    Object.assign(this, properties);
  }
}
