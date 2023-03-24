import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { IndicatorDTO } from '../dto/indicator.dto';

export interface MobileServiceInterface {
  findIndicatorsByCustomer(
    customerId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<IndicatorDTO[]>>;
}
