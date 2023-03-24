import { AssistantRequestEntity } from '../entities/assistant-request.entity';

export class AssistantRequestDTO {
  id: string;
  customerId: string;
  customerName: string;
  responsibleId: string;
  responsibleName: string;
  assistantId: string;
  assistantName: string;
  startDate: Date;
  responsibleMessage: string;
  endDate: Date;

  public static fromEntity(
    entity: AssistantRequestEntity,
  ): AssistantRequestDTO {
    const dto = new AssistantRequestDTO();
    dto.id = entity.assistant_requestid;
    dto.customerId = entity.customer.customerid;
    dto.customerName = entity.customer.name;
    dto.responsibleId = entity.responsible.squaduserid;
    dto.responsibleName = `${entity.responsible.name} - ${entity.responsible.role}`;
    dto.startDate = entity.start_date;
    dto.responsibleMessage = entity.responsible_message;
    dto.endDate = entity.end_date;
    return dto;
  }
}
