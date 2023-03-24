import { Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/components/customer/entities/customer.entity';
import { ReminderEntity } from 'src/components/reminder/entities/reminder.entity';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { SquadUserEntity } from 'src/components/shared/entities/squad-user.entity';
import { TeamSquadEntity } from 'src/components/teamsquad/entities/team-squad.entity';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { itHasNext } from 'src/components/shared/lib/common-functions';
import { DatabaseService } from 'src/database/database.service';
import { SelectQueryBuilder } from 'typeorm';
import { CustomerResponsibleDto } from '../dto/customer-responsible.dto';
import { CustomerResponsibleMapper } from '../mappers/customer-responsible.mapper';

@Injectable()
export class GetAllCustomerResponsibleUseCase
  implements UseCase<GetBaseResponseDTO<CustomerResponsibleDto[]>>
{
  private readonly mapper = new CustomerResponsibleMapper();

  constructor(private readonly dbService: DatabaseService) {}

  private selectResponsibles(
    query: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    query
      .select(`s.squaduserid, s.name as squaduser_name`)
      .from(SquadUserEntity, 's')
      .innerJoin(TeamSquadEntity, 'ts', 's.squaduserid = ts.squaduserid')
      .where('ts.isresponsible = true AND ts.deletiondate IS NULL');
    return query;
  }

  private joinCustomer(
    query: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    query
      .innerJoin(CustomerEntity, 'c', 'ts.customerid = c.customerid')
      .addSelect('c.customerid', 'customerid')
      .addSelect('c.name', 'customer_name');
    return query;
  }

  private joinCompany(query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
    query
      .innerJoin(
        (subQuery) => subQuery.select().from('company', 'cp'),
        'cp',
        'cp.companyid = c.companyid',
      )
      .addSelect('cp.companyid', 'companyid')
      .addSelect('cp.name', 'company_name');
    return query;
  }

  private joinReminder(
    query: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    query
      .leftJoin(
        ReminderEntity,
        'r',
        'c.customerid = r.customerid and s.squaduserid = r.squaduserid',
      )
      .addSelect('reminderid')
      .addSelect('reminder', 'reminder_text')
      .addSelect('r.creationdate', 'reminder_creationdate')
      .addSelect('r.lastmodificationdate', 'reminder_lastmodificationdate');

    return query;
  }

  private addReponsibleFilter(squadUserId: string) {
    return (query: SelectQueryBuilder<any>) => {
      if (squadUserId) {
        query.where('s.squaduserid = :squadUserId', {
          squadUserId,
        });
      }
      return query;
    };
  }

  private addCustomerFilter(customerId: string) {
    return (query: SelectQueryBuilder<any>) => {
      if (customerId) {
        query.andWhere('customerid = :customerId', {
          customerId,
        });
      }
      return query;
    };
  }

  private pipe(
    ...methods: { (query: SelectQueryBuilder<any>): SelectQueryBuilder<any> }[]
  ): SelectQueryBuilder<any> {
    return methods.reduce(
      (query, method) => method(query),
      this.dbService.getDbHandle().createQueryBuilder(),
    );
  }

  async execute(
    queryParams: BaseQueryParametersDTO,
    filter: { squadUserId?: string; customerId?: string },
  ): Promise<GetBaseResponseDTO<CustomerResponsibleDto[]>> {
    const results: GetBaseResponseDTO<CustomerResponsibleDto[]> = {
      items: [],
      hasNext: false,
      _messages: null,
    };
    const hasPagination = queryParams.Page && queryParams.PageSize;

    const query = this.pipe(
      this.selectResponsibles,
      this.addReponsibleFilter(filter.squadUserId),
      this.joinCustomer,
      this.addCustomerFilter(filter.customerId),
      this.joinCompany,
      this.joinReminder,
    );

    if (hasPagination) {
      const skip = (queryParams.Page - 1) * queryParams.PageSize;
      const take = queryParams.PageSize;

      query.offset(skip);
      query.limit(take);
    }
    const rawResults = await query.getRawMany();

    if (hasPagination) {
      const { count: total } = await query
        .select('COUNT(*)', 'count')
        .getRawOne();
      results.hasNext = itHasNext(
        total,
        queryParams.Page,
        queryParams.PageSize,
      );
    }
    results.items = rawResults.map((result) => this.mapper.mapFrom(result));

    return results;
  }
}
