import { Inject, Injectable } from '@nestjs/common';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { itHasNext } from 'src/components/shared/lib/common-functions';
import { FindConditions, FindManyOptions } from 'typeorm';
import { ReminderDto } from '../dto/reminder.dto';
import { ReminderEntity } from '../entities/reminder.entity';
import { ReminderRepositoryInterface } from '../interfaces/reminder.repository.interface';
import { ReminderUseCaseInterface } from '../interfaces/reminder.usecase.interface';
import { ReminderMapper } from '../mappers/reminder.mapper';

@Injectable()
export class GetAllRemindersUseCase implements ReminderUseCaseInterface {
  private readonly mapper = new ReminderMapper();
  constructor(
    @Inject('ReminderRepositoryInterface')
    private readonly reminderRepository: ReminderRepositoryInterface,
  ) {}

  async execute(
    queryParams: BaseQueryParametersDTO,
    filter: { customerId?: string; squadUserId?: string },
  ): Promise<GetBaseResponseDTO<ReminderDto[]>> {
    const options: FindManyOptions<ReminderEntity> = {};
    const where: FindConditions<ReminderEntity> = {};
    const results: GetBaseResponseDTO<ReminderDto[]> = {
      items: [],
      hasNext: false,
      _messages: null,
    };

    const hasPagination = queryParams?.Page && queryParams?.PageSize;

    if (filter?.squadUserId) where.squaduser = <any>filter.squadUserId;
    if (filter?.customerId) where.customer = <any>filter.customerId;
    if (filter?.customerId || filter.squadUserId) options.where = where;

    if (hasPagination) {
      const { skip, take } = this.reminderRepository.pagination(
        queryParams.Page,
        queryParams.PageSize,
      );
      options.skip = skip;
      options.take = take;
    }
    const [reminders, total] = await this.reminderRepository.findAndCount(
      options,
    );

    results.items = reminders.map((reminder) => this.mapper.mapFrom(reminder));
    results.hasNext = hasPagination
      ? itHasNext(total, queryParams.Page, queryParams.PageSize)
      : false;

    return results;
  }
}
