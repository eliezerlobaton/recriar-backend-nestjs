import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteIllnessDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
