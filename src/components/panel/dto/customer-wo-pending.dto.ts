import { CustomerWithoutPendingTasksRawDataDTO } from "./customer-wo-pending-raw-data.dto";

export class CustomerWithoutPendingTasksDTO {
  customerId: string;
  customerName: string;
  responsibleId: string;
  responsibleName: string;

  public static fromRawData(
    customer: CustomerWithoutPendingTasksRawDataDTO,
  ): CustomerWithoutPendingTasksDTO {
    const newDTO = new CustomerWithoutPendingTasksDTO();
    newDTO.customerId = customer.customerid;
    newDTO.customerName = customer.customername;
    newDTO.responsibleId = customer.responsibleid;
    newDTO.responsibleName = customer.responsiblename;
    return newDTO;
  }
}
