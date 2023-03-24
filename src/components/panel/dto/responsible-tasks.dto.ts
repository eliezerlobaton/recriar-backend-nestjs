import { dateDifferenceInDays } from 'src/components/shared/lib/common-functions';
import { BaseTaskDTO } from './base-task.dto';
import { ResponsibleTasksRawDataDTO } from './responsible-tasks-raw-data.dto';

export class ResponsibleTasksDTO extends BaseTaskDTO {
  taskCreatorId: string;
  taskCreatorName: string;

  public static fromRawData(
    rawData: ResponsibleTasksRawDataDTO,
  ): ResponsibleTasksDTO {
    const newData = new ResponsibleTasksDTO();
    newData.customerId = rawData.customerid;
    newData.customerName = rawData.customername;
    newData.taskId = rawData.taskid;
    newData.taskType = rawData.tasktype;
    newData.taskDescription = rawData.taskdescription;
    newData.taskCreatorId = rawData.taskcreatorid;
    newData.initialDate = rawData.initialdate;
    newData.taskCreatorName = rawData.taskcreatorname;
    newData.pendingDays = dateDifferenceInDays(
      Date.now(),
      Date.parse(rawData.initialdate),
    );
    return newData;
  }
}
