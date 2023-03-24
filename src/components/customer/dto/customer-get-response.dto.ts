import { GetBaseResponseDTO } from '../../shared/dto/base-get-response.dto';
import { CustomerEntityDTO } from './customer.entity.dto';

export class CustomerGetResponseDTO extends GetBaseResponseDTO<
  CustomerEntityDTO[]
> {}
