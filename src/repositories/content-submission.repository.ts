import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentSubmissionEntity } from '../components/content-submission/entities/content-submission.entity';
import { ContentSubmissionRepositoryInterface } from '../components/content-submission/interfaces/content-submission.repository.interface';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { ContentSubmissionFilterQueryDTO } from 'src/components/content-submission/dto/content-submission-filter-query.dto';

@Injectable()
export class ContentSubmissionRepository
  extends BaseAbstractRepository<ContentSubmissionEntity>
  implements ContentSubmissionRepositoryInterface
{
  constructor(
    @InjectRepository(ContentSubmissionEntity)
    private readonly contentSubmissionRepository: Repository<ContentSubmissionEntity>,
  ) {
    super(contentSubmissionRepository);
  }

  async findOneByIdWithRelations(
    submissionId: string,
  ): Promise<ContentSubmissionEntity> {
    const query =
      this.contentSubmissionRepository.createQueryBuilder('submission');
    query.where('submission.content_submissionid = :id', { id: submissionId });
    query.innerJoinAndSelect('submission.customer', 'customer');
    query.innerJoinAndSelect('submission.knowledge', 'knowledge');
    query.innerJoinAndSelect('submission.content', 'content');
    const submission = await query.getOne();
    return submission;
  }

  async filterSubmissionsByCustomerId(
    customerId: string,
    queryParams: ContentSubmissionFilterQueryDTO,
  ): Promise<{ result: ContentSubmissionEntity[]; total: number }> {
    const query = this.queryPagination('content_submission', queryParams);

    query.where('content_submission.customerid = :customerid', {
      customerid: customerId,
    });

    if (queryParams?.KnowledgeObjectiveId) {
      query.andWhere(
        'content_submission.knowledge_objectiveid = :objectiveid',
        {
          objectiveid: queryParams.KnowledgeObjectiveId,
        },
      );
    }

    if (queryParams?.KnowledgeId) {
      query.andWhere('content_submission.knowledgeid = :knowledgeid', {
        knowledgeid: queryParams.KnowledgeId,
      });
    }

    if (queryParams?.ContentId) {
      query.andWhere('content_submission.contentid = :contentid', {
        contentid: queryParams.ContentId,
      });
    }

    if (queryParams?.Status) {
      query.andWhere('content_submission.status = :status', {
        status: queryParams.Status,
      });
    }

    if (queryParams?.IsFavorite) {
      query.andWhere('content_submission.is_favorite = :isfavorite', {
        isfavorite: queryParams.IsFavorite,
      });
    }

    query.innerJoinAndSelect('content_submission.customer', 'customer');
    query.innerJoinAndSelect('content_submission.knowledge', 'knowledge');
    query.innerJoinAndSelect('content_submission.content', 'content');

    const [result, total] = await query.getManyAndCount();

    return { result, total };
  }
}
