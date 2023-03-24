import { AssistantRequestDTO } from 'src/components/assistant-request/dto/assistant-request.dto';
import { AssistantRequestEntity } from 'src/components/assistant-request/entities/assistant-request.entity';
import { Mapper } from 'src/components/shared/mappers/mapper';

export class ForwardMapper extends Mapper<
  AssistantRequestEntity,
  AssistantRequestDTO
> {
  public mapFrom(data: AssistantRequestEntity): AssistantRequestDTO {
    const forward = new AssistantRequestDTO();

    forward.id = data.assistant_requestid;
    forward.customerId = data.customer.customerid;
    forward.customerName = data.customer.name;
    forward.responsibleId = data.responsible.squaduserid;
    forward.responsibleName = `${data.responsible.name} - ${data.responsible.role}`;
    forward.assistantId = data.assistant.squaduserid;
    forward.assistantName = `${data.assistant.name} - ${data.assistant.role}`;
    forward.responsibleMessage = data.responsible_message;
    forward.startDate = data.start_date;
    forward.endDate = data.end_date;

    return forward;
  }

  public mapTo(data: AssistantRequestDTO): AssistantRequestEntity {
    const forward = new AssistantRequestEntity();

    forward.assistant_requestid = data.id;
    forward.customer.customerid = data.customerId;
    forward.customer.name = data.customerName;
    forward.responsible = <any>data.responsibleId;
    forward.assistant = <any>data.assistantId;
    forward.responsible_message = data.responsibleMessage;
    forward.start_date = data.startDate;
    forward.end_date = data.endDate;

    return forward;
  }
}
