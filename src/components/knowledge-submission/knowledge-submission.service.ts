import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnprocessableEntityException } from '@nestjs/common';
import { ContentSubmissionRepositoryInterface } from '../content-submission/interfaces/content-submission.repository.interface';
import { KnowledgeSubmissionStatus } from '../shared/dto/enums/common-enum';
import { KnowledgeFilterQueryDTO } from '../shared/dto/knowledge-filter-query.dto';
import { SquadUserRepositoryInterface } from '../shared/interfaces/squad-user.repository.interface';
import { KnowledgeSubmissionDTO } from './dto/knowledge-submission.dto';
import { NewKnowledgeSubmissionDTO } from './dto/new-knowledge-submission.dto';
import { ResendKnowledgeSubmissionDTO } from './dto/resend-knowledge-submission.dto';
import { UpdatedKnowledgeSubmission } from './dto/update-knowledge-submission.dto';
import { KnowledgeSubmissionRepositoryInterface } from './interfaces/knowledge-submission.repository.interface';
import { KnowledgeSubmissionServiceInterface } from './interfaces/knowledge-submission.service.interface';

@Injectable()
export class KnowledgeSubmissionService
  implements KnowledgeSubmissionServiceInterface
{
  constructor(
    @Inject('KnowledgeSubmissionRepositoryInterface')
    private readonly knowledgeSubmissionRepository: KnowledgeSubmissionRepositoryInterface,
    @Inject('ContentSubmissionRepositoryInterface')
    private readonly contentSubmissionRepository: ContentSubmissionRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async filterByCustomerId(
    customerId: string,
    queryParams: KnowledgeFilterQueryDTO,
  ): Promise<{ result: KnowledgeSubmissionDTO[]; hasNext: boolean }> {
    const { result, hasNext } =
      await this.knowledgeSubmissionRepository.filterSubmissionsByCustomerId(
        customerId,
        queryParams,
      );
    const submissions = result.map((entity) => {
      return KnowledgeSubmissionDTO.fromEntity(entity);
    });

    return {
      result: submissions,
      hasNext: hasNext,
    };
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

  async create(
    newSubmission: NewKnowledgeSubmissionDTO,
  ): Promise<KnowledgeSubmissionDTO> {
    const { result: existentSubmission } =
      await this.knowledgeSubmissionRepository.filterSubmissionsByCustomerId(
        newSubmission.customerId,
        {
          KnowledgeId: newSubmission.knowledgeId,
          KnowledgeObjectiveId: newSubmission.knowledgeObjectiveId,
          Status: null,
        },
      );

    if (existentSubmission.length > 0) {
      throw new UnprocessableEntityException('Knowledge has already been sent');
    }
    newSubmission.squadUserToken = await this.findSquadUserByToken(
      newSubmission.squadUserToken,
    );
    const entity = KnowledgeSubmissionDTO.fromDto(newSubmission);
    entity.status = KnowledgeSubmissionStatus.Pending;
    const result = await this.knowledgeSubmissionRepository.create(entity);
    const submission =
      await this.knowledgeSubmissionRepository.findOneByIdWithRelations(
        result.knowledge_submissionid,
      );
    return KnowledgeSubmissionDTO.fromEntity(submission);
  }

  async update(
    updatedKnowledgeSubmission: UpdatedKnowledgeSubmission,
  ): Promise<KnowledgeSubmissionDTO> {
    const found = await this.knowledgeSubmissionRepository.findOneById(
      UpdatedKnowledgeSubmission.fromDto(updatedKnowledgeSubmission)
        .knowledge_submissionid,
    );
    if (!found) throw new UnprocessableEntityException('Register not found');

    const result = await this.knowledgeSubmissionRepository.updateOne(
      UpdatedKnowledgeSubmission.fromDto(updatedKnowledgeSubmission),
    );
    const submission =
      await this.knowledgeSubmissionRepository.findOneByIdWithRelations(
        result.knowledge_submissionid,
      );
    return KnowledgeSubmissionDTO.fromEntity(submission);
  }

  async resend(
    resendKnowledgeSubmission: ResendKnowledgeSubmissionDTO,
  ): Promise<KnowledgeSubmissionDTO> {
    const { id } = resendKnowledgeSubmission;

    const activeSubmission =
      await this.knowledgeSubmissionRepository.findOneById(id);

    if (!!activeSubmission) {
      // SoftDelete previous submission
      const deletedPrevious = await this.knowledgeSubmissionRepository.delete(
        activeSubmission.knowledge_submissionid,
      );

      if (!deletedPrevious) {
        throw new BadRequestException(`Cannot delete previous submission`);
      }
    } else {
      throw new UnprocessableEntityException(
        'There is no older valid submission.',
      );
    }

    // SoftDelete cascade ContentSubmission
    const { result: contentSubmissionsToDelete } =
      await this.contentSubmissionRepository.filterSubmissionsByCustomerId(
        activeSubmission.customer.customerid,
        {
          KnowledgeId: activeSubmission.knowledge.knowledgeid,
        },
      );

    contentSubmissionsToDelete.map((submission) => {
      this.contentSubmissionRepository.delete(submission.content_submissionid);
    });

    // Create newSubmission
    return await this.create({
      knowledgeId: activeSubmission.knowledge.knowledgeid,
      customerId: activeSubmission.customer.customerid,
      squadUserToken: resendKnowledgeSubmission.squadUserToken,
      knowledgeObjectiveId:
        activeSubmission.knowledge_objective.knowledge_objectiveid,
    });
  }
}
