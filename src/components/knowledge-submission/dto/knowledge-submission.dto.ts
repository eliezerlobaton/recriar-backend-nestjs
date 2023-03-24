import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ScaleEntity } from 'src/components/shared/entities/scale.entity';
import { KnowledgeSubmissionEntity } from '../entities/knowledge-submission.entity';
import { NewKnowledgeSubmissionDTO } from './new-knowledge-submission.dto';

export class KnowledgeSubmissionDTO extends NewKnowledgeSubmissionDTO {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  answerDate: Date;

  @ApiProperty()
  sendDate: Date;

  description?: string;

  @Exclude()
  scale?: ScaleEntity;

  public static fromEntity(
    entity: KnowledgeSubmissionEntity,
  ): KnowledgeSubmissionDTO {
    const answer = (<string[]>(<unknown>entity.knowledge.scale.scales))[
      entity.answer
    ];
    return {
      id: entity.knowledge_submissionid,
      status: entity.status,
      answer: answer ? answer : null,
      answerDate: entity.answer_date,
      sendDate: entity.send_date,
      customerId: entity.customer.customerid,
      knowledgeId: entity.knowledge.knowledgeid,
      description: entity.knowledge.description,
      squadUserToken: entity.squad_userid,
      scale: entity.knowledge.scale,
    };
  }

  /**
   * fromDto
   */
  public static fromDto(
    dto: NewKnowledgeSubmissionDTO,
  ): KnowledgeSubmissionEntity {
    const entity = new KnowledgeSubmissionEntity();
    entity.customer = <any>dto.customerId;
    entity.knowledge = <any>dto.knowledgeId;
    entity.squad_userid = dto.squadUserToken;
    entity.knowledge_objective = <any>dto.knowledgeObjectiveId;
    return entity;
  }
}
