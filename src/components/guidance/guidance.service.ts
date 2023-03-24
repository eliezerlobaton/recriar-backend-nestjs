import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { configService } from 'src/config/config.service';
import { FilesServiceInterface } from 'src/files/interfaces/files.service.interface';
import { BehaviorEntity } from '../behavior/entities/behavior.entity';
import { BehaviorRepositoryInterface } from '../behavior/interfaces/behavior.repository.interface';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';
import { itHasNext } from '../shared/lib/common-functions';
import { CreateGuidanceDto } from './dto/create-guidance.dto';
import { GuidanceQueryParametersDTO } from './dto/guidance-query-parameters.dto';
import { GuidanceDTO } from './dto/guidance.dto';
import { ResendGuidanceDTO } from './dto/resend-guidance.dto';
import { SaveResultDTO } from './dto/save-result.dto';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { GuidanceEntity } from './entities/guidance.entity';
import { GuidanceRepositoryInterface } from './interfaces/guidance.repository.interface';
import { GuidanceServiceInterface } from './interfaces/guidance.service.interface';
import { AutomaticallySendUseCase } from './use-cases/automatically-send.usecase';
import { CreateGuidanceUseCase } from './use-cases/create-guidance.usecase';
import { GetGuidanceDtoUseCase } from './use-cases/get-guidance-dto.usecase';

@Injectable()
export class GuidanceService implements GuidanceServiceInterface {
  constructor(
    @Inject('GuidanceRepositoryInterface')
    private readonly guidanceRepository: GuidanceRepositoryInterface,
    @Inject('BehaviorRepositoryInterface')
    private readonly behaviorRepository: BehaviorRepositoryInterface,
    @Inject('FilesServiceInterface')
    private readonly filesService: FilesServiceInterface,
    private readonly automaticallySend: AutomaticallySendUseCase,
    private readonly createGuidance: CreateGuidanceUseCase,
    private readonly getGuidanceDto: GetGuidanceDtoUseCase,
  ) {}

  async saveResult(saveResultDto: SaveResultDTO): Promise<GuidanceDTO> {
    const updated = await this.guidanceRepository.updateOne(
      SaveResultDTO.fromDTO(saveResultDto),
    );
    const [guidance] = await this.guidanceRepository.findWithRelations({
      relations: ['customer', 'behavior', 'sent_by'],
      where: {
        guidanceid: updated.guidanceid,
      },
    });
    return this.getGuidanceDto.execute(guidance);
  }

  async listGuidanceResultImages(): Promise<any[]> {
    return this.filesService.listPublicFiles(
      configService.getGuidanceBucketName(),
    );
  }

  async findAllByCustomerAndReponsible(
    customerId: string,
    reponsibleId: string,
    queryParams: GuidanceQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<GuidanceDTO[]>> {
    const guidances = await this.guidanceRepository.findAllByCustomerId(
      customerId,
      queryParams,
      false,
      reponsibleId,
    );
    return {
      _messages: guidances._messages,
      items: await Promise.all(
        guidances.items.map((guidance) =>
          this.getGuidanceDto.execute(guidance),
        ),
      ),
      hasNext: guidances.hasNext,
    };
  }

  async findAllHistoriesByCustomer(
    customerId: string,
    queryParams: GuidanceQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<GuidanceDTO[]>> {
    const { items, hasNext, _messages } =
      await this.guidanceRepository.findAllByCustomerId(
        customerId,
        queryParams,
        true,
      );
    return {
      items: await Promise.all(
        items.map((item) => this.getGuidanceDto.execute(item)),
      ),
      hasNext,
      _messages,
    };
  }

  async findOneHistoryById(guidanceId: string): Promise<GuidanceDTO> {
    const guidance = await this.guidanceRepository.findOneById(
      guidanceId,
      true,
    );
    if (!guidance) throw new NotFoundException('Guidance id not found');
    return await this.getGuidanceDto.execute(guidance);
  }

  async findOneById(guidanceId: string): Promise<GuidanceDTO> {
    const guidance = await this.guidanceRepository.findOneById(guidanceId);
    if (!guidance) throw new NotFoundException('Guidance id not found');
    return await this.getGuidanceDto.execute(guidance);
  }

  async resend(resendGuidanceDto: ResendGuidanceDTO): Promise<GuidanceDTO> {
    const previusGuidance = await this.guidanceRepository.findOneById(
      resendGuidanceDto.id,
    );
    if (!previusGuidance) throw new NotFoundException('Guidance id not found');
    await this.guidanceRepository.delete(resendGuidanceDto.id);
    const created = await this.create(resendGuidanceDto);
    return created;
  }

  private async buildGuidanceDTO(
    behaviors: BehaviorEntity[],
    guidances: GuidanceEntity[],
    customerId: string,
    queryParams: GuidanceQueryParametersDTO,
  ): Promise<GuidanceDTO[]> {
    const guidanceDTOs = [];
    for (const behavior of behaviors) {
      const guidance = guidances.find(
        (guidance) => guidance.behavior.behaviorid === behavior.behaviorid,
      );
      if (guidance) {
        const guidanceDto = await this.getGuidanceDto.execute(guidance);
        guidanceDto.alreadySent = true;
        guidanceDTOs.push(guidanceDto);
      } else if (!queryParams?.Status) {
        const guidanceDto = GuidanceDTO.fromBehaviorEntity(behavior);
        guidanceDto.customerId = customerId;
        guidanceDTOs.push(guidanceDto);
      }
    }
    return guidanceDTOs;
  }

  async findAllByCustomer(
    customerId: string,
    queryParams: GuidanceQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<GuidanceDTO[]>> {
    const behaviors = {
      items: [],
      hasNext: false,
    };
    await this.automaticallySend.execute(customerId);
    const guidances = await this.guidanceRepository.findAllByCustomerId(
      customerId,
      queryParams,
    );
    if (queryParams?.BehaviorId) queryParams.Search = queryParams.BehaviorId;
    const { items, total } =
      await this.behaviorRepository.searchByDescriptionAndIntegrationId(
        queryParams,
      );
    behaviors.items = items;
    if (queryParams?.Page && queryParams?.PageSize)
      behaviors.hasNext = itHasNext(
        total,
        queryParams.Page,
        queryParams.PageSize,
      );
    const guidancesDtos = await this.buildGuidanceDTO(
      behaviors.items,
      guidances.items,
      customerId,
      queryParams,
    );
    return {
      items: guidancesDtos.filter((guidance) => !!guidance),
      hasNext: behaviors.hasNext || guidances.hasNext,
      _messages: null,
    };
  }

  async create(createGuidanceDto: CreateGuidanceDto): Promise<GuidanceDTO> {
    return this.createGuidance.execute(createGuidanceDto);
  }

  async update(updateGuidanceDto: UpdateGuidanceDto): Promise<GuidanceDTO> {
    const guidanceFound = await this.guidanceRepository.findOneById(
      updateGuidanceDto.id,
    );
    if (!guidanceFound)
      throw new UnprocessableEntityException('Guidance not found');
    guidanceFound.status = updateGuidanceDto.status;
    if (updateGuidanceDto?.answer && !guidanceFound.result) {
      guidanceFound.result = updateGuidanceDto.answer;
    }
    const updated = await this.guidanceRepository.updateOne(guidanceFound);
    const [guidance] = await this.guidanceRepository.findWithRelations({
      relations: ['customer', 'behavior', 'sent_by'],
      where: {
        guidanceid: updated.guidanceid,
      },
    });
    return await this.getGuidanceDto.execute(guidance);
  }
}
