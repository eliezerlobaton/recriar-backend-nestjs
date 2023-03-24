import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ContentSubmissionEntity } from '../entities/content-submission.entity';

export class NewContentSubmissionDTO {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  contentId: string;

  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  knowledgeId: string;

  @IsOptional()
  @IsJWT()
  squadUserToken?: string;

  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  knowledgeObjectiveId?: string;

  public static fromEntity(
    entity: ContentSubmissionEntity,
  ): NewContentSubmissionDTO {
    return {
      contentId: entity.content_submissionid,
      customerId: entity.customer.customerid,
      knowledgeId: entity.knowledge.knowledgeid,
    };
  }

  public static fromDTO(
    dto: NewContentSubmissionDTO,
  ): Partial<ContentSubmissionEntity> {
    return {
      customer: <any>dto.customerId,
      content: <any>dto.contentId,
      knowledge: <any>dto.knowledgeId,
      squad_userid: dto.squadUserToken,
      knowledge_objective: <any>dto.knowledgeObjectiveId,
    };
  }
}
