import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export abstract class BaseQueryParametersDTO
  implements Partial<BaseQueryParametersDTO>
{
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  Page?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  PageSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  Search?: string;
}
