import { DeleteResult, FindManyOptions } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: T | any): Promise<T>;

  findOneById(id: number | string): Promise<T>;

  findByCondition(filterCondition: any): Promise<T[]>;

  findOneByCondition(filterCondition: any): Promise<T>;

  findAll(): Promise<T[]>;

  updateOne(data: T | any): Promise<T>;

  remove(id: number | string): Promise<DeleteResult>;

  delete(id: number | string): Promise<DeleteResult>;

  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;

  findAndCount(conditons: FindManyOptions): Promise<[T[], number]>;

  pagination(page: number, pageSize: number): { skip: number; take: number };
}
