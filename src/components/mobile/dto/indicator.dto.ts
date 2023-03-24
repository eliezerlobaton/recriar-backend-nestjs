import { ApiProperty } from '@nestjs/swagger';
import { KnowledgeSubmissionDTO } from 'src/components/knowledge-submission/dto/knowledge-submission.dto';
import { formatToDate } from 'src/components/shared/lib/common-functions';
import { route } from '../enum/route.enum';

export class IndicatorDTO {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  dateTime: string;

  @ApiProperty()
  indicator: number;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  scales: string[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  route: route;

  public static fromKnowldege(knowledge: KnowledgeSubmissionDTO): IndicatorDTO {
    const date = formatToDate(knowledge.sendDate);
    const scales = <string[]>(<unknown>knowledge.scale.scales);
    const indicator = scales.indexOf(knowledge.answer);
    return {
      id: knowledge.id,
      date,
      dateTime: knowledge.sendDate.toJSON(),
      description: knowledge.description,
      indicator,
      answer: knowledge.answer,
      scales,
      route: route.knowledge,
    };
  }
}
