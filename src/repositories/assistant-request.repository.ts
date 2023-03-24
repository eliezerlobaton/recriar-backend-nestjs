import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssistantRequestEntity } from 'src/components/assistant-request/entities/assistant-request.entity';
import { AssistantRequestRepositoryInterface } from 'src/components/assistant-request/interfaces/assistant-request.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class AssistantRequestRepository
  extends BaseAbstractRepository<AssistantRequestEntity>
  implements AssistantRequestRepositoryInterface
{
  constructor(
    @InjectRepository(AssistantRequestEntity)
    private readonly assistantRequestRepository: Repository<AssistantRequestEntity>,
  ) {
    super(assistantRequestRepository);
  }

  async checkActiveRequest(
    responsibleId: string,
    customerId: string,
    assistantId: string,
  ): Promise<boolean> {
    const found = await this.assistantRequestRepository.find({
      where: {
        responsible: <any>responsibleId,
        customer: <any>customerId,
        assistant: <any>assistantId,
        end_date: null,
      },
    });
    return found?.length > 0;
  }

  async filterActiveRequestByAssistantId(
    assistantId: string,
  ): Promise<AssistantRequestEntity[]> {
    return this.findWithRelations({
      relations: ['customer', 'responsible', 'assistant'],
      where: {
        assistant: <any>assistantId,
        end_date: null,
      },
    });
  }
}
