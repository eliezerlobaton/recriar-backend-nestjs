import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  squad: string;

  @ApiProperty({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customer: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}
