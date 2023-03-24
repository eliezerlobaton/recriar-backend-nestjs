import { Inject, Injectable } from '@nestjs/common';
import { AssistantRequestRepositoryInterface } from '../assistant-request/interfaces/assistant-request.repository.interface';
import { TeamSquadDTO } from '../shared/dto/team-squad.dto';
import { SquadUserRepositoryInterface } from '../shared/interfaces/squad-user.repository.interface';
import { TeamSquadRepositoryInterface } from '../teamsquad/interfaces/team-squad.repository.interface';
import { transformObjectKeys } from '../shared/lib/common-functions';
import { CustomerQueryDTO } from './dto/customer-query.dto';
import { CustomerEntityDTO } from './dto/customer.entity.dto';
import { CustomerRepositoryInterface } from './interfaces/customer.repository.interface';
import { CustomerServiceInterface } from './interfaces/customer.service.interface';

@Injectable()
export class CustomerService implements CustomerServiceInterface {
  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    @Inject('TeamSquadRepositoryInterface')
    private readonly teamSquadRepository: TeamSquadRepositoryInterface,
    @Inject('AssistantRequestRepositoryInterface')
    private readonly assistantRequestRepository: AssistantRequestRepositoryInterface,
  ) {}

  async GetCustomerTeamSquad(customerId: string): Promise<TeamSquadDTO[]> {
    const teamSquad = await this.teamSquadRepository.findByCondition({
      customerid: customerId,
    });

    const teamSquadMembers = teamSquad.map(async (teamsquad) => {
      const squadUser = await this.squadUserRepository.findOneById(
        teamsquad.squaduserid,
      );

      const assistantRequest =
        await this.assistantRequestRepository.findOneByCondition({
          customer: teamsquad.customerid,
          assistant: squadUser.squaduserid,
          end_date: null,
        });

      const isAssistant = typeof assistantRequest !== 'undefined';

      return {
        id: squadUser.squaduserid,
        name: squadUser.name,
        role: squadUser.role,
        isResponsible: teamsquad.isresponsible,
        isAssistant: isAssistant,
      };
    });
    return await Promise.all(teamSquadMembers);
  }

  async GetCustomersWithQuery(
    query: CustomerQueryDTO,
  ): Promise<CustomerEntityDTO[]> {
    const lowercaseQuery = transformObjectKeys(query, (key) =>
      key.toLowerCase(),
    );
    const customer = await this.customerRepository.findByCondition(
      lowercaseQuery,
    );
    return customer;
  }
}
