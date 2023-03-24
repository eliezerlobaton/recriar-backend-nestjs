import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ContentSubmissionStatus } from 'src/components/shared/dto/enums/common-enum';
import { ContentSubmissionEntity } from '../entities/content-submission.entity';

export class UpdateContentSubmissionDTO {
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
  ratingDate?: Date;

  @ApiProperty()
  @IsOptional()
  sendDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isFavorite: boolean;

  answer?: number;
  /**
   * fromDTO
   */
  public static fromDTO(
    dto: UpdateContentSubmissionDTO,
  ): Partial<ContentSubmissionEntity> {
    return {
      content_submissionid: dto.id,
      status: dto.status,
      rating_date: dto.ratingDate,
      rating: dto.rating,
      is_favorite: dto.isFavorite,
    };
  }
}
