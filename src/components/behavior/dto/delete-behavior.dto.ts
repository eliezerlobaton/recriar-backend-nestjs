import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteBehaviorDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
