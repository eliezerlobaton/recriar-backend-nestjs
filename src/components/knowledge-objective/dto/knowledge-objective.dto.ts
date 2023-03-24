import { ApiProperty } from '@nestjs/swagger';
import { KnowledgeObjectiveEntity } from 'src/components/knowledge-objective/entities/knowledge-objective.entity';
import { KnowledgeType } from '../../shared/dto/enums/common-enum';
import { KnowledgeConditionDTO } from '../../shared/dto/knowledge-condition.dto';

export class KnowledgeObjectiveDTO {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  integrationId: string;

  @ApiProperty({ enum: KnowledgeType })
  knowledgeType: KnowledgeType;

  @ApiProperty()
  knowledgeConditions?: KnowledgeConditionDTO[];

  public static fromEntity(
    objective: KnowledgeObjectiveEntity,
  ): KnowledgeObjectiveDTO {
    return {
      id: objective.knowledge_objectiveid,
      description: objective.description,
      integrationId: objective.integrationid,
      knowledgeType: objective.knowledgetype,
    };
  }
}
