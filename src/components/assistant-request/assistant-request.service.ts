import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SquadUserRepositoryInterface } from '../shared/interfaces/squad-user.repository.interface';
import { TeamSquadRepositoryInterface } from '../teamsquad/interfaces/team-squad.repository.interface';
import { findSquadUserByToken } from '../shared/lib/common-functions';
import { AssistantRequestDTO } from './dto/assistant-request.dto';
import { CreateAssistantRequestDto } from './dto/create-assistant-request.dto';
import { FinishAssistanceDTO } from './dto/finish-assistance.dto';
import { AssistantRequestRepositoryInterface } from './interfaces/assistant-request.repository.interface';
import { AssistantRequestServiceInterface } from './interfaces/assistant-request.service.interface';

@Injectable()
export class AssistantRequestService
  implements AssistantRequestServiceInterface
{
  constructor(
    @Inject('AssistantRequestRepositoryInterface')
    private readonly assistantRequestRepository: AssistantRequestRepositoryInterface,
    @Inject('TeamSquadRepositoryInterface')
    private readonly teamSquadRepository: TeamSquadRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async filterActiveRequestByAssistant(assistantId: string): Promise<any> {
    const result =
      await this.assistantRequestRepository.filterActiveRequestByAssistantId(
        assistantId,
      );
    return result.map((entity) => AssistantRequestDTO.fromEntity(entity));
  }

  async create(createAssistantRequestDto: CreateAssistantRequestDto) {
    createAssistantRequestDto.responsibleId = await findSquadUserByToken(
      createAssistantRequestDto.sentBy,
      this.jwtService,
      this.squadUserRepository,
    );
    if (createAssistantRequestDto.responsibleId === '')
      throw new BadRequestException(
        'It was not possible to find squad user by bearer token',
      );
    const isResponsible = await this.teamSquadRepository.isResponsible(
      createAssistantRequestDto.responsibleId,
      createAssistantRequestDto.customerId,
    );

    if (!isResponsible) {
      throw new UnprocessableEntityException(
        'You are not responsible for this customer',
      );
    }

    if (
      isResponsible &&
      createAssistantRequestDto.assistantId ===
        createAssistantRequestDto.responsibleId
    ) {
      throw new UnprocessableEntityException(
        'The responsible cannot be an assistant',
      );
    }

    const existingRequest =
      await this.assistantRequestRepository.checkActiveRequest(
        createAssistantRequestDto.responsibleId,
        createAssistantRequestDto.customerId,
        createAssistantRequestDto.assistantId,
      );
    if (existingRequest) {
      throw new UnprocessableEntityException(
        'Operation not allowed: The assistance request is still open',
      );
    }
    return this.assistantRequestRepository.create(
      CreateAssistantRequestDto.fromDTO(createAssistantRequestDto),
    );
  }

  async findAll() {
    const result = await this.assistantRequestRepository.findAll();
    return result.map((entity) => AssistantRequestDTO.fromEntity(entity));
  }

  async findOne(id: string) {
    const found = await this.assistantRequestRepository.findOneById(id);
    return AssistantRequestDTO.fromEntity(found);
  }

  async delete(id: string) {
    return await this.assistantRequestRepository.delete(id);
  }

  async finishAssistance(
    finishDTO: FinishAssistanceDTO,
  ): Promise<AssistantRequestDTO> {
    finishDTO.responsibleId = await findSquadUserByToken(
      finishDTO.sentBy,
      this.jwtService,
      this.squadUserRepository,
    );
    if (finishDTO.responsibleId === '')
      throw new BadRequestException(
        'It was not possible to find squad user by bearer token',
      );
    const found = await this.assistantRequestRepository.findOneByCondition({
      customer: finishDTO.customerId,
      assistant: finishDTO.assistantId,
      responsible: finishDTO.responsibleId,
      end_date: null,
    });
    if (!found) throw new UnprocessableEntityException('Register not found');

    const updated = await this.assistantRequestRepository.updateOne({
      assistant_requestid: found.assistant_requestid,
      end_date: new Date(),
    });
    const result = (
      await this.assistantRequestRepository.findWithRelations({
        relations: ['customer', 'responsible'],
        where: {
          assistant_requestid: updated.assistant_requestid,
        },
      })
    ).shift();
    return AssistantRequestDTO.fromEntity(result);
  }
}
