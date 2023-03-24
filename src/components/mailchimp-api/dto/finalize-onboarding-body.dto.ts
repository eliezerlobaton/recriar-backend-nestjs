import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FinalizeOnBoardingBody {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  customerId: string;
}
