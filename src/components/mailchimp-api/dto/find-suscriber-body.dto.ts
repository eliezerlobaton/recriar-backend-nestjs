import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindSubscriberBody {
  @ApiProperty()
  @IsNotEmpty()
  customerCpf: string;
}
