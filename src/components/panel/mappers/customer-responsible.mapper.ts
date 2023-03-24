import { Mapper } from 'src/components/shared/mappers/mapper';
import { CustomerResponsibleRawDto } from '../dto/customer-responsible-raw.dto';
import { CustomerResponsibleDto } from '../dto/customer-responsible.dto';

export class CustomerResponsibleMapper extends Mapper<
  CustomerResponsibleRawDto,
  CustomerResponsibleDto
> {
  public mapFrom(data: CustomerResponsibleRawDto): CustomerResponsibleDto {
    const mappedData = new CustomerResponsibleDto();

    mappedData.customer = {
      id: data.customerid,
      name: data.customer_name,
    };
    mappedData.company = {
      id: data.companyid,
      name: data.company_name,
    };
    mappedData.squadUser = {
      id: data.squaduserid,
      name: data.squaduser_name,
    };
    mappedData.reminder = {
      id: data.reminderid,
      reminder: data.reminder_text,
      creationDate: data.reminder_creationdate,
      lastModificatioDate: data.reminder_lastmodificationdate,
    };

    return mappedData;
  }
  public mapTo(data: CustomerResponsibleDto): CustomerResponsibleRawDto {
    const mappedData = new CustomerResponsibleRawDto();
    return mappedData;
  }
}
