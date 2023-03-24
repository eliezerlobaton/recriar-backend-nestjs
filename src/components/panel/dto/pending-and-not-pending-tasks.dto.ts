import { AssistantTasksDTO } from './assistant-tasks.dto';
import { CustomerWithoutPendingTasksDTO } from './customer-wo-pending.dto';

export class PendingAndNotPendingTasksDTO {
  withPendingTasks: AssistantTasksDTO[];
  withoutPendingTasks: CustomerWithoutPendingTasksDTO[];
}
