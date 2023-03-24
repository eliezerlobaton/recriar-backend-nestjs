import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuidanceQueryParametersDTO } from 'src/components/guidance/dto/guidance-query-parameters.dto';
import { GuidanceEntity } from 'src/components/guidance/entities/guidance.entity';
import { GuidanceRepositoryInterface } from 'src/components/guidance/interfaces/guidance.repository.interface';
import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { itHasNext } from 'src/components/shared/lib/common-functions';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class GuidanceRepository
  extends BaseAbstractRepository<GuidanceEntity>
  implements GuidanceRepositoryInterface
{
  constructor(
    @InjectRepository(GuidanceEntity)
    private readonly guidanceRepository: Repository<GuidanceEntity>,
  ) {
    super(guidanceRepository);
  }

  async findOneById(
    guidanceId: string,
    withDeteled?: boolean,
  ): Promise<GuidanceEntity> {
    const query = this.createQueryBuilder('guidance');
    query.where('guidance.guidanceid = :id', { id: guidanceId });
    if (withDeteled) query.withDeleted();
    query.innerJoinAndSelect('guidance.customer', 'customer');
    query.innerJoinAndSelect('guidance.behavior', 'behavior');
    query.innerJoinAndSelect('guidance.sent_by', 'squad');
    return await query.getOne();
  }

  async findAllByCustomerId(
    customerId: string,
    queryParams: GuidanceQueryParametersDTO,
    withDeleted?: boolean,
    responsibleId?: string,
  ): Promise<GetBaseResponseDTO<GuidanceEntity[]>> {
    const result: GetBaseResponseDTO<GuidanceEntity[]> = {
      _messages: null,
      hasNext: false,
      items: [],
    };
    const query = this.createQueryBuilder('guidance');

    try {
      query.innerJoinAndSelect(
        'guidance.customer',
        'customer',
        'guidance.customerid = :customerid',
        { customerid: customerId },
      );

      if (responsibleId) {
        query.where('guidance.responsible = :responsibleid', {
          responsibleid: responsibleId,
        });
      }

      if (queryParams?.Status) {
        query.andWhere('guidance.status = :status', {
          status: queryParams.Status,
        });
      }

      if (queryParams?.BehaviorId) {
        query.innerJoinAndSelect(
          'guidance.behavior',
          'behavior',
          'guidance.behaviorid = :id',
          {
            id: queryParams.BehaviorId,
          },
        );
      } else {
        query.innerJoinAndSelect('guidance.behavior', 'behavior');
      }

      if (queryParams?.BehaviorType) {
        query.where('behavior.behavior_type = :type ', {
          type: queryParams.BehaviorType,
        });
      }

      if (withDeleted) query.withDeleted();

      query.leftJoinAndSelect('guidance.sent_by', 'squad');

      if (queryParams?.Page && queryParams?.PageSize) {
        const { skip, take } = this.pagination(
          queryParams.Page,
          queryParams.PageSize,
        );
        query.skip(skip);
        query.take(take);
        const [guidances, total] = await query.getManyAndCount();

        result.items = guidances;
        result.hasNext = itHasNext(
          total,
          queryParams.Page,
          queryParams.PageSize,
        );
      } else {
        result.items = await query.getMany();
      }
    } catch (error) {
      Logger.error(error, 'GuidanceRepository');
      console.log(error);
      result._messages = error;
    }

    return result;
  }
}
