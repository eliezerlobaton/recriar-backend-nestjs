import { Inject, Injectable } from '@nestjs/common';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { ContentSubmissionRepositoryInterface } from '../content-submission/interfaces/content-submission.repository.interface';
import { KnowledgeEntity } from '../knowledge/entities/knowledge.entity';
import { KnowledgeRepositoryInterface } from '../knowledge/interfaces/knowledge.repository.interface';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { TranslatedContentType } from '../shared/dto/enums/common-enum';
import {
  capitalizeString,
  getPaginationIndexes,
  itHasNext,
} from '../shared/lib/common-functions';
import { ContentFilterQueryDTO } from './dto/content-filter-query.dto';
import { ContentSentDTO } from './dto/content-sent.dto';
import { ContentDTO } from './dto/content.dto';
import { ContentEntity } from './entities/content.entity';
import { ContentRepositoryInterface } from './interfaces/content.repository.interface';
import { ContentServiceInterface } from './interfaces/content.service.interface';

@Injectable()
export class ContentService implements ContentServiceInterface {
  constructor(
    @Inject('ContentRepositoryInterface')
    private readonly contentRepository: ContentRepositoryInterface,
    @Inject('ContentSubmissionRepositoryInterface')
    private readonly submissionRepository: ContentSubmissionRepositoryInterface,
    @Inject('KnowledgeRepositoryInterface')
    private readonly knowledgeRepository: KnowledgeRepositoryInterface,
  ) {}

  async GetAll(
    queryParams: ContentFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentDTO[]>> {
    const { result, total } = await this.contentRepository.findAllByQuery(
      queryParams,
    );
    const { Page = 1, PageSize = 100 } = queryParams;

    const items = result.map((content: ContentEntity) => {
      return new ContentDTO(instanceToPlain(content));
    });

    return {
      items,
      hasNext: itHasNext(total, Page, PageSize),
      _messages: '',
    };
  }

  private checkContentType(contentType: string, valueToCheck: string): boolean {
    return Object.keys(TranslatedContentType).includes(
      capitalizeString(valueToCheck),
    )
      ? contentType.includes(
          TranslatedContentType[capitalizeString(valueToCheck)],
        )
      : false;
  }

  private checkKnowledges(
    knowledges: KnowledgeEntity[],
    regex: RegExp,
  ): boolean {
    return knowledges.find((knowledge: KnowledgeEntity) =>
      knowledge.description.match(regex),
    )
      ? true
      : false;
  }

  private applySearchInContents(
    contents: ContentEntity[],
    search: string,
  ): ContentEntity[] {
    const searchResult = contents.filter((content: ContentEntity) => {
      const regex = new RegExp(`(${search})`, 'gi');
      const title = content.title.match(regex);

      const knowledges = content?.contentxknowledges
        ? this.checkKnowledges(
            <KnowledgeEntity[]>(<unknown>content.contentxknowledges),
            regex,
          )
        : false;

      return (
        title ||
        knowledges ||
        this.checkContentType(content.contenttype, search)
      );
    });
    return searchResult;
  }

  async FilterByKnowledgeObjective(
    objectiveId: string,
    queryParams: BaseQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<ContentDTO[]>> {
    const { result: knowledges = [] } =
      await this.knowledgeRepository.getKnowledgeByKnowledgeObjectiveId(
        objectiveId,
        {},
      );

    let contentPromises: any[] = knowledges.map(async (knowledge) => {
      const { result: contents = [] } =
        await this.contentRepository.findAllByQuery({
          KnowledgeId: knowledge.knowledgeid,
        });
      return contents;
    });

    contentPromises = await Promise.all(contentPromises);
    contentPromises = contentPromises.reduce(
      (prev, curr) => prev.concat(curr),
      [],
    );

    if (queryParams?.Search) {
      contentPromises = this.applySearchInContents(
        contentPromises,
        queryParams.Search,
      );
    }

    const { pageStart, pageEnd, hasNext } = getPaginationIndexes(
      contentPromises.length,
      queryParams?.Page,
      queryParams?.PageSize,
    );

    return {
      items: contentPromises.slice(pageStart, pageEnd),
      hasNext: hasNext,
      _messages: null,
    };
  }

  async FilterSentByCustomerAndKnowledge(
    customerid: string,
    queryParams: ContentFilterQueryDTO,
  ): Promise<GetBaseResponseDTO<ContentSentDTO[]>> {
    const { Page = 1, PageSize = 100 } = queryParams;
    const { result, total } = await this.contentRepository.findAllByQuery(
      queryParams,
    );
    const submissions =
      await this.submissionRepository.filterSubmissionsByCustomerId(
        customerid,
        { KnowledgeId: queryParams.KnowledgeId, Status: null },
      );
    const items = result.map((content) => {
      const found = submissions.result.find(
        (submission) => submission.content.contentid === content.contentid,
      );
      const ret = plainToClass(ContentSentDTO, instanceToPlain(content), {
        excludeExtraneousValues: true,
      });
      ret.alreadySent = found !== undefined ? true : false;
      return ret;
    });
    return { items, hasNext: itHasNext(total, Page, PageSize), _messages: '' };
  }

  async FindByContentId(contentId: string): Promise<ContentDTO> {
    const content = await this.contentRepository.findOneByCondition({
      contentid: contentId,
    });
    return new ContentDTO(instanceToPlain(content));
  }
}
