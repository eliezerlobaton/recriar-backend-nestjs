import { GuidanceEntity } from 'src/components/guidance/entities/guidance.entity';
import { AppStatus } from 'src/components/shared/dto/enums/common-enum';

export class CalculateResponsesDTO {
  behavior: string;
  customer: string;
  result: string[];
  status: AppStatus;
  sentBy: string;

  public static fromEntity(entity: GuidanceEntity): CalculateResponsesDTO {
    const { behavior, customer, result, status, sent_by } = entity;
    return {
      behavior: behavior.integrationid,
      customer: customer.name,
      result: [...result.split('\n')],
      status,
      sentBy: sent_by.name,
    };
  }
}
