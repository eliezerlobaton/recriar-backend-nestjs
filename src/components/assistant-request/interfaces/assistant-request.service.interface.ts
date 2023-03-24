import { AssistantRequestDTO } from '../dto/assistant-request.dto';
import { FinishAssistanceDTO } from '../dto/finish-assistance.dto';

export interface AssistantRequestServiceInterface {
  filterActiveRequestByAssistant(assistantId: string): Promise<boolean>;
  finishAssistance(
    finishDTO: FinishAssistanceDTO,
  ): Promise<AssistantRequestDTO>;
}
