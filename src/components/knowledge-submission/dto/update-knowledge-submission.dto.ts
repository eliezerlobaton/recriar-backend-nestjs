import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { KnowledgeSubmissionStatus } from 'src/components/shared/dto/enums/common-enum';
import { KnowledgeSubmissionEntity } from '../entities/knowledge-submission.entity';

export class UpdatedKnowledgeSubmission {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ enum: KnowledgeSubmissionStatus })
  @IsNotEmpty()
  @IsEnum(KnowledgeSubmissionStatus, {
    message: `Status value must be one of these: ${Object.values(
      KnowledgeSubmissionStatus,
    ).join()}`,
  })
  status: KnowledgeSubmissionStatus;

  @ApiProperty()
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 })
  @Min(0)
  @Max(6)
  answer: number;

  public static fromDto(
    dto: UpdatedKnowledgeSubmission,
  ): KnowledgeSubmissionEntity {
    const entity = new KnowledgeSubmissionEntity();
    entity.knowledge_submissionid = <any>dto.id;
    entity.status = <any>dto.status;
    entity.answer = dto.answer;
    entity.answer_date = new Date();
    return entity;
  }
}
