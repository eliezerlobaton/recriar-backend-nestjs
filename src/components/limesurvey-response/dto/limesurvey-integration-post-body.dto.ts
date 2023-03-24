import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class LimesurveyIntegrationPostBodyDTO {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ isArray: true })
  surveysIds: number[];
}
