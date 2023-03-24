import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { AssistantRequestEntity } from '../entities/assistant-request.entity';

export interface AssistantRequestRepositoryInterface
  extends BaseInterfaceRepository<AssistantRequestEntity> {
  checkActiveRequest(
    responsibleId: string,
    customerId: string,
    assistantId: string,
  ): Promise<boolean>;
  filterActiveRequestByAssistantId(
    assistantId: string,
  ): Promise<AssistantRequestEntity[]>;
}
