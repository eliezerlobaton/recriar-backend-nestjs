import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteWatcherDto {
  @IsNotEmpty()
  @IsString()
  resourceId: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
