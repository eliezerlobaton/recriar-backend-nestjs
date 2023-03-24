import {
  BadRequestException,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SquadUserRepositoryInterface } from 'src/components/shared/interfaces/squad-user.repository.interface';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { findSquadUserByToken } from 'src/components/shared/lib/common-functions';
import { CreateGuidanceDto } from '../dto/create-guidance.dto';
import { GuidanceDTO } from '../dto/guidance.dto';
import { GuidanceRepositoryInterface } from '../interfaces/guidance.repository.interface';
import { GetGuidanceDtoUseCase } from './get-guidance-dto.usecase';

export class CreateGuidanceUseCase implements UseCase<GuidanceDTO> {
  constructor(
    @Inject('GuidanceRepositoryInterface')
    private readonly guidanceRepository: GuidanceRepositoryInterface,
    @Inject('SquadUserRepositoryInterface')
    private readonly squadUserRepository: SquadUserRepositoryInterface,
    private readonly jwtService: JwtService,
    private readonly getGuidanceDto: GetGuidanceDtoUseCase,
  ) {}

  async execute(createGuidanceDto: CreateGuidanceDto): Promise<GuidanceDTO> {
    createGuidanceDto.sentBy = createGuidanceDto?.sentBy
      ? await findSquadUserByToken(
          createGuidanceDto.sentBy,
          this.jwtService,
          this.squadUserRepository,
        )
      : null;
    if (createGuidanceDto.sentBy === '')
      throw new BadRequestException(
        'It was not possible to find squad user by bearer token',
      );
    const entity = CreateGuidanceDto.fromDTO(createGuidanceDto);
    const { items: guidanceFound } =
      await this.guidanceRepository.findAllByCustomerId(<any>entity.customer, {
        BehaviorId: <any>entity.behavior,
      });

    if (guidanceFound.length > 0)
      throw new UnprocessableEntityException('Guidance has already been sent');

    const created = await this.guidanceRepository.create(
      CreateGuidanceDto.fromDTO(createGuidanceDto),
    );
    const [guidance] = await this.guidanceRepository.findWithRelations({
      relations: ['customer', 'behavior', 'sent_by'],
      where: { guidanceid: created.guidanceid },
    });
    return await this.getGuidanceDto.execute(guidance);
  }
}
