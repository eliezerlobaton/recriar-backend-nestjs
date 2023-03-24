import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import {
  ContentSubmissionStatus,
  RateType,
} from '../../shared/dto/enums/common-enum';
import { ContentSubmissionEntity } from '../entities/content-submission.entity';
import { NewContentSubmissionDTO } from './new-content-submission.dto';

export class ContentSubmissionDTO extends NewContentSubmissionDTO {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ enum: ContentSubmissionStatus })
  @IsNotEmpty()
  @IsEnum(ContentSubmissionStatus, {
    message: `Status value must be one of these: ${Object.values(
      ContentSubmissionStatus,
    ).join()}`,
  })
  status: ContentSubmissionStatus;

  @ApiProperty()
  @IsOptional()
  knowledgeAnswer?: string;

  @ApiProperty()
  @IsOptional()
  ratingDate: Date;

  @ApiProperty()
  sendDate: Date;

  @ApiProperty()
  @IsOptional()
  rating: string;

  knowledgeDescription?: string;

  description?: string;

  // App compatibility
  answer?: number;
  answerDate?: Date;

  @ApiProperty()
  readingTime?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;

  public static fromDTO(
    dto: ContentSubmissionDTO,
  ): Partial<ContentSubmissionEntity> {
    const { status } = dto;
    return {
      content_submissionid: dto.id,
      content: <any>dto.contentId,
      customer: <any>dto.customerId,
      knowledge: <any>dto.knowledgeId,
      rating: Object.values(RateType).indexOf(<any>dto.rating),
      rating_date: dto.ratingDate,
      is_favorite: dto.isFavorite,
      send_date: dto.sendDate,
      squad_userid: dto.squadUserToken,
      status,
    };
  }

  public static fromEntity(
    entity: ContentSubmissionEntity,
    knowledgeSubmissionAnswer?: string,
  ): ContentSubmissionDTO {
    const rating = Object.values(RateType)[entity.rating];
    return {
      id: entity.content_submissionid,
      knowledgeAnswer: knowledgeSubmissionAnswer ?? '',
      ratingDate: entity.rating_date,
      answer: entity.rating, // app compatibility
      answerDate: entity.rating_date, // app compatibility
      rating,
      status: entity.status,
      sendDate: entity.send_date,
      squadUserToken: entity.squad_userid,
      readingTime: entity.content.readingtime,
      customerId: entity.customer.customerid,
      contentId: entity.content.contentid,
      description: entity.content.title,
      knowledgeId: entity.knowledge.knowledgeid,
      knowledgeDescription: entity.knowledge.description,
      isFavorite: entity.is_favorite,
    };
  }
}
