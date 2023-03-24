import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { ContentFilterQueryDTO } from '../dto/content-filter-query.dto';
import { ContentEntity } from '../entities/content.entity';

export interface ContentRepositoryInterface
  extends BaseInterfaceRepository<ContentEntity> {
  findAllByQuery(
    queryParams: ContentFilterQueryDTO,
  ): Promise<{ result: ContentEntity[]; total: number }>;
}
