import { TeamSquadDTO } from 'src/components/shared/dto/team-squad.dto';
import { CustomerQueryDTO } from '../dto/customer-query.dto';
import { CustomerEntityDTO } from '../dto/customer.entity.dto';

export interface CustomerServiceInterface {
  GetCustomersWithQuery(query: CustomerQueryDTO): Promise<CustomerEntityDTO[]>;
  GetCustomerTeamSquad(customerId: string): Promise<TeamSquadDTO[]>;
}
