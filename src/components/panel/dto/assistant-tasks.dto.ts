import { dateDifferenceInDays } from 'src/components/shared/lib/common-functions';
import { AssistantTasksRawDataDTO } from './assistant-tasks-raw-data.dto';
import { BaseTaskDTO } from './base-task.dto';

export class AssistantTasksDTO extends BaseTaskDTO {
  responsibleId: string;
  responsibleName: string;

  public static fromRawData(
    rawData: AssistantTasksRawDataDTO,
  ): AssistantTasksDTO {
    const newData = new AssistantTasksDTO();
    newData.customerId = rawData.customerid;
    newData.customerName = rawData.customername;
    newData.taskId = rawData.taskid;
    newData.taskType = rawData.tasktype;
    newData.taskDescription = rawData.taskdescription;
    newData.responsibleId = rawData.responsibleid;
    newData.initialDate = rawData.initialdate;
    newData.responsibleName = rawData.responsiblename;
    newData.pendingDays = dateDifferenceInDays(
      Date.now(),
      Date.parse(rawData.initialdate),
    );
    return newData;
  }
}
