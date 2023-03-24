import { ApiProperty } from '@nestjs/swagger';
import { KnowledgeType } from '../../shared/dto/enums/common-enum';
import { KnowledgeObjectiveDTO } from '../../knowledge-objective/dto/knowledge-objective.dto';
import { ScaleDTO } from 'src/components/shared/dto/scale.dto';

export class KnowledgeDTO {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  integrationId: string;

  @ApiProperty({ enum: KnowledgeType })
  knowledgeType: KnowledgeType;

  @ApiProperty()
  knowledgeObjectives: KnowledgeObjectiveDTO[];

  scale: ScaleDTO;
}
