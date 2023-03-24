import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomerRepositoryInterface } from 'src/components/customer/interfaces/customer.repository.interface';
import { SquadUserRepositoryInterface } from 'src/components/shared/interfaces/squad-user.repository.interface';
import { ScheduledAttendanceStatus } from '../enum/scheduled-attendance-status.enum';
import { ScheduledAttendanceRepositoryInterface } from '../interfaces/scheduled-attendance.repository.interface';

@Injectable()
export class CreateMockAttendancesService {
  constructor(
    @Inject('ScheduledAttendanceRepositoryInterface')
    private readonly repository: ScheduledAttendanceRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  private createRadomDates(
    range: { start: Date; end: Date },
    qtd: number,
    dates: any[],
  ) {
    if (dates.length >= qtd) {
      return dates;
    }
    const date = new Date(
      range.start.getTime() +
        Math.random() * (range.end.getTime() - range.start.getTime()),
    );
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() + 1,
    );
    dates.push([date, endDate]);
    return this.createRadomDates(range, qtd, dates);
  }

  private async getRadomCustomerIds(qtd: number): Promise<string[]> {
    const ids: string[] = [];
    const customers = await this.customerRepository.findAll();
    for (let counter = 0; counter < qtd; counter++) {
      ids.push(
        customers[Math.floor(Math.random() * customers.length)].customerid,
      );
    }
    return ids;
  }

  private async getRadomSquadUsersIds(qtd: number): Promise<string[]> {
    const ids: string[] = [];
    const squadUsers = await this.squadUserRepository.findAll();
    for (let counter = 0; counter < qtd; counter++) {
      ids.push(
        squadUsers[Math.floor(Math.random() * squadUsers.length)].squaduserid,
      );
    }
    return ids;
  }

  async run(
    limit: number,
    ids?: { squadUserId?: string; customerId?: string },
  ): Promise<any> {
    const dates = this.createRadomDates(
      { start: new Date(2022, 4, 1), end: new Date(2022, 6, 1) },
      limit,
      [],
    );
    const squadUsers = ids?.squadUserId
      ? Array(limit).fill(ids.squadUserId)
      : await this.getRadomSquadUsersIds(limit);
    const customers = ids?.customerId
      ? Array(limit).fill(ids.customerId)
      : await this.getRadomCustomerIds(limit);
    const attendances = [];
    for (let counter = 0; counter < limit; counter++) {
      try {
        const scheduledAttendance = {
          squaduser: <any>squadUsers[counter],
          customer: <any>customers[counter],
          event_uri: 'www.eventourl.com.br',
          name: `Evento aleatorio nº ${counter}`,
          status: ScheduledAttendanceStatus.Active,
          start_date: dates[counter][0],
          end_date: dates[counter][1],
          event_type: `Evento aleatorio nº ${counter}`,
          reason: `Razão aleatoria nº ${counter}`,
        };
        Logger.log(scheduledAttendance);
        attendances.push(await this.repository.create(scheduledAttendance));
      } catch (error) {
        Logger.error(error);
      }
    }
    return attendances;
  }
}
