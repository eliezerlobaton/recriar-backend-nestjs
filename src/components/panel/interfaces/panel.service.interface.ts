import { AssistantTasksDTO } from '../dto/assistant-tasks.dto';
import { PendingAndNotPendingTasksDTO } from '../dto/pending-and-not-pending-tasks.dto';
import { ResponsibleTasksDTO } from '../dto/responsible-tasks.dto';

export interface PanelServiceInterface {
  getAllTasksByResponsible(responsibleId: string): Promise<ResponsibleTasksDTO[]>;
  getPendingTasksByAssistant(assistantId: string): Promise<PendingAndNotPendingTasksDTO>;
}
