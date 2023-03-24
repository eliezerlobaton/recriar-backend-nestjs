import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KnowledgeSubmissionEntity } from '../components/knowledge-submission/entities/knowledge-submission.entity';
import { KnowledgeSubmissionRepositoryInterface } from '../components/knowledge-submission/interfaces/knowledge-submission.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { KnowledgeFilterQueryDTO } from 'src/components/shared/dto/knowledge-filter-query.dto';

@Injectable()
export class KnowledgeSubmissionRepository
  extends BaseAbstractRepository<KnowledgeSubmissionEntity>
  implements KnowledgeSubmissionRepositoryInterface
{
  constructor(
    @InjectRepository(KnowledgeSubmissionEntity)
    private readonly knowledgeSubmissionRepository: Repository<KnowledgeSubmissionEntity>,
  ) {
    super(knowledgeSubmissionRepository);
  }

  async findOneByIdWithRelations(
    submissionId: string,
  ): Promise<KnowledgeSubmissionEntity> {
    const query =
      this.knowledgeSubmissionRepository.createQueryBuilder('submission');
    query.where('submission.knowledge_submissionid = :id', {
      id: submissionId,
    });
    query.innerJoinAndSelect('submission.customer', 'customer');
    query.innerJoinAndSelect('submission.knowledge', 'knowledge');
    query.innerJoinAndSelect('knowledge.scale', 'scale');
    const submission = await query.getOne();
    return submission;
  }

  async filterSubmissionsByCustomerId(
    customerId: string,
    queryParams: KnowledgeFilterQueryDTO,
  ): Promise<{ result: KnowledgeSubmissionEntity[]; hasNext: boolean }> {
    const query = this.queryPagination('knowledge_submission', queryParams);
    query.where('knowledge_submission.customerid = :customerid', {
      customerid: customerId,
    });

    if (queryParams?.KnowledgeObjectiveId) {
      query.andWhere(
        'knowledge_submission.knowledge_objectiveid = :objectiveid',
        {
          objectiveid: queryParams.KnowledgeObjectiveId,
        },
      );
    }

    if (queryParams?.KnowledgeId) {
      query.andWhere('knowledge_submission.knowledgeid = :knowledgeid', {
        knowledgeid: queryParams.KnowledgeId,
      });
    }

    if (queryParams?.Status) {
      query.andWhere('knowledge_submission.status = :status', {
        status: queryParams.Status,
      });
    }

    const { PageSize: limit = 100, Page: page = 1 } = queryParams;
    query.innerJoinAndSelect('knowledge_submission.customer', 'customer');
    query.innerJoinAndSelect('knowledge_submission.knowledge', 'knowledge');
    query.innerJoinAndSelect('knowledge.scale', 'scale');
    const [result, total] = await query.getManyAndCount();

    const hasNext = total > page * limit;
    return { result, hasNext };
  }
}
