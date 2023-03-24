import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseQueryParametersDTO } from 'src/components/shared/dto/base-query-parameters.dto';
import { BaseInterfaceRepository } from './base.interface.repository';
import { PostgresErrorCode } from 'src/components/shared/dto/enums/common-enum';

@Injectable()
export abstract class BaseAbstractRepository<T>
  implements BaseInterfaceRepository<T>
{
  constructor(private entity: Repository<T>) {}

  public async updateOne(data: T | any): Promise<T> {
    return await this.entity.save(data);
  }

  public async create(data: T | any): Promise<T> {
    try {
      return await this.entity.save(data);
    } catch (error) {
      Logger.error(error);
      if (error?.code === PostgresErrorCode.ForeignKeyViolation)
        throw new UnprocessableEntityException('There is an invalid key');
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new ConflictException('Register already exists');
      throw new InternalServerErrorException('It was not possible to save');
    }
  }

  public async findOneById(id: number | string): Promise<T> {
    return await this.entity.findOne(id);
  }

  public async findOneByCondition(filterCondition: any): Promise<T> {
    return (
      await this.entity.find({ where: filterCondition, take: 1 })
    ).shift();
  }

  public async findByCondition(filterCondition: any): Promise<T[]> {
    return await this.entity.find({ where: filterCondition });
  }

  public async findAll(): Promise<T[]> {
    return await this.entity.find();
  }

  public async remove(id: string): Promise<DeleteResult> {
    return await this.entity.delete(id);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.entity.softDelete(id);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    console.log(relations);
    return await this.entity.find({
      relations: relations.relations,
      where: relations.where,
    });
  }

  public async findAndCount(
    conditons: FindManyOptions<any>,
  ): Promise<[T[], number]> {
    return await this.entity.findAndCount(conditons);
  }

  public pagination(
    page: number,
    pageSize: number,
  ): { skip: number; take: number } {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    return { skip, take };
  }
  /**
   * queryPagination
   */
  public queryPagination(
    name: string,
    queryParams: BaseQueryParametersDTO,
  ): SelectQueryBuilder<T> {
    const query = this.entity.createQueryBuilder(name);

    const { PageSize: limit = 100, Page: page = 1 } = queryParams;
    const { skip, take } = this.pagination(page, limit);
    query.skip(skip);
    query.take(take);
    return query;
  }

  protected createQueryBuilder(name: string): SelectQueryBuilder<T> {
    return this.entity.createQueryBuilder(name);
  }
}
