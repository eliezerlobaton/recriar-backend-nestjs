export abstract class BaseTaskDTO {
  customerId: string;
  customerName: string;
  taskId: string;
  taskType: string;
  taskDescription: string;
  initialDate: Date | string;
  pendingDays?: number;
}
