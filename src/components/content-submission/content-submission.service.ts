import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { KnowledgeSubmissionDTO } from '../knowledge-submission/dto/knowledge-submission.dto';
import { KnowledgeSubmissionRepositoryInterface } from '../knowledge-submission/interfaces/knowledge-submission.repository.interface';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { SquadUserRepositoryInterface } from '../shared/interfaces/squad-user.repository.interface';
import { itHasNext } from '../shared/lib/common-functions';
import { ContentSubmissionFilterQueryDTO } from './dto/content-submission-filter-query.dto';
import { ContentSubmissionDTO } from './dto/content-submission.dto';
import { NewContentSubmissionDTO } from './dto/new-content-submission.dto';
import { UpdateContentSubmissionDTO } from './dto/update-content-submission.dto';
import { ContentSubmissionRepositoryInterface } from './interfaces/content-submission.repository.interface';
import { ContentSubmissionServiceInterface } from './interfaces/content-submission.service.interface';

@Injectable()
export class ContentSubmissionService
  implements ContentSubmissionServiceInterface
{
  constructor(
    @Inject('ContentSubmissionRepositoryInterface')
    private readonly contentSubmissionRepository: ContentSubmissionRepositoryInterface,
    @Inject('KnowledgeSubmissionRepositoryInterface')
    private readonly knowledgeSubmissionRepository: KnowledgeSubmissionRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async update(
    updatedContentSubmission: UpdateContentSubmissionDTO,
  ): Promise<ContentSubmissionDTO> {
    // Handle old versions that use answer instead of rating
    if (!updatedContentSubmission?.rating) {
      updatedContentSubmission.rating = updatedContentSubmission.answer;
    }

    updatedContentSubmission.ratingDate = new Date();
    const data = UpdateContentSubmissionDTO.fromDTO(updatedContentSubmission);
    const found = await this.contentSubmissionRepository.findOneById(
      updatedContentSubmission.id,
    );
    if (!found) throw new UnprocessableEntityException('Register not found');
    const updated = await this.contentSubmissionRepository.updateOne(data);
    const submission =
      await this.contentSubmissionRepository.findOneByIdWithRelations(
        updated.content_submissionid,
      );
    return ContentSubmissionDTO.fromEntity(submission);
  }

  private async findSquadUserByToken(squadUserToken: string): Promise<string> {
    if (typeof squadUserToken !== 'undefined') {
      const { name, email, user_id } = <any>(
        this.jwtService.decode(squadUserToken)
      );

      const squadUser = await this.squadUserRepository.findOneByCondition({
        name,
        email,
        squaduserid: user_id,
      });

      if (typeof squadUser !== 'undefined') {
        return squadUser.squaduserid;
      }
    }
    return '';
  }

  async NewContentSubmission(
    newSubmission: NewContentSubmissionDTO,
  ): Promise<ContentSubmissionDTO> {
    const { contentId, customerId } = newSubmission;
    const submission = NewContentSubmissionDTO.fromDTO(newSubmission);
    submission.squad_userid = await this.findSquadUserByToken(
      newSubmission.squadUserToken,
    );

    const { result: existentSubmission } =
      await this.contentSubmissionRepository.filterSubmissionsByCustomerId(
        customerId,
        {
          ContentId: contentId,
        },
      );

    if (existentSubmission.length > 0) {
      throw new UnprocessableEntityException('Content has already been sent');
    }

    const result = await this.contentSubmissionRepository.create(submission);
    result.content_submissionid;
    const created = (
      await this.contentSubmissionRepository.findWithRelations({
        relations: ['knowledge', 'content', 'customer'],
        where: {
          content_submissionid: result.content_submissionid,
        },
      })
    ).pop();
    return ContentSubmissionDTO.fromEntity(created);
  }

  async GetByCustomer(
    customerId: string,
    queryParams: ContentSubmissionFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentSubmissionDTO[]>> {
    const { result, total } =
      await this.contentSubmissionRepository.filterSubmissionsByCustomerId(
        customerId,
        queryParams,
      );
    const knowledgeSubmissionAnswers = {};

    const knowledgeAnswersPromises = result.map(async (contentSubmission) => {
      const knowledgeId = contentSubmission.knowledge.knowledgeid;

      if (!knowledgeSubmissionAnswers?.[knowledgeId]) {
        const { result: knowledgeSubmissions } =
          await this.knowledgeSubmissionRepository.filterSubmissionsByCustomerId(
            contentSubmission.customer.customerid,
            {
              KnowledgeId: knowledgeId,
              Status: null,
            },
          );
        const { answer } = KnowledgeSubmissionDTO.fromEntity(
          knowledgeSubmissions[0],
        );
        knowledgeSubmissionAnswers[knowledgeId] = answer;
        return answer;
      }
      return knowledgeSubmissionAnswers[knowledgeId];
    });

    await Promise.all(knowledgeAnswersPromises);
    return {
      items: result.map((submission) =>
        ContentSubmissionDTO.fromEntity(
          submission,
          knowledgeSubmissionAnswers[submission.knowledge.knowledgeid],
        ),
      ),
      hasNext: itHasNext(total, queryParams.Page, queryParams.PageSize),
      _messages: '',
    };
  }
}
