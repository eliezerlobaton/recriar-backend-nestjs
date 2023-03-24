import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { CustomerGetResponseDTO } from './dto/customer-get-response.dto';
import { CustomerQueryDTO } from './dto/customer-query.dto';
import { CustomerServiceInterface } from './interfaces/customer.service.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    @Inject('CustomerServiceInterface')
    private readonly customerService: CustomerServiceInterface,
  ) {}

  @Get()
  async GetCustomersWithQuery(
    @Query() query: CustomerQueryDTO,
  ): Promise<CustomerGetResponseDTO> {
    const customers = await this.customerService.GetCustomersWithQuery(query);
    return {
      hasNext: true,
      items: customers,
      _messages: null,
    };
  }

  @Get('/teamsquad/:customerid')
  async GetCustomerTeamSquad(@Param('customerid') customerId: string) {
    return await this.customerService.GetCustomerTeamSquad(customerId);
  }
}
