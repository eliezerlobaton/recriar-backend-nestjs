import { ScaleEntity } from '../entities/scale.entity';

export class ScaleDTO {
  id: string;

  description: string;

  scales: string[];

  integrationId: string;

  public static fromEntity(entity: ScaleEntity): ScaleDTO {
    return {
      id: entity.scaleid,
      description: entity.description,
      integrationId: entity.integrationid,
      scales: <string[]>(<unknown>entity.scales),
    };
  }
}
