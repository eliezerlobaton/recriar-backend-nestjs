import { Inject, Injectable } from '@nestjs/common';
import { BehaviorEntity } from 'src/components/behavior/entities/behavior.entity';
import { BehaviorRepositoryInterface } from 'src/components/behavior/interfaces/behavior.repository.interface';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { GuidanceDTO } from '../dto/guidance.dto';
import { GuidanceEntity } from '../entities/guidance.entity';
import { GuidanceRepositoryInterface } from '../interfaces/guidance.repository.interface';
import { CreateGuidanceUseCase } from './create-guidance.usecase';

@Injectable()
export class AutomaticallySendUseCase implements UseCase<GuidanceDTO[]> {
  constructor(
    @Inject('BehaviorRepositoryInterface')
    private readonly behaviorRepository: BehaviorRepositoryInterface,
    @Inject('GuidanceRepositoryInterface')
    private readonly guidanceRepository: GuidanceRepositoryInterface,
    private readonly createGuidance: CreateGuidanceUseCase,
  ) {}

  private async findExistingGuidance(
    behaviorId: string,
    customerId: string,
  ): Promise<GuidanceEntity | false> {
    const { items: guidances } =
      await this.guidanceRepository.findAllByCustomerId(customerId, {
        BehaviorId: behaviorId,
      });
    const guidance = guidances.shift();
    return guidance ? guidance : false;
  }

  private async filterBehaviorToSend(): Promise<BehaviorEntity[]> {
    const behaviors = await this.behaviorRepository.findByCondition({
      automatic_send: true,
    });
    return behaviors;
  }

  private async filterToCreate(
    behaviors: BehaviorEntity[],
    toCreate: BehaviorEntity[],
    customerId: string,
  ): Promise<BehaviorEntity[]> {
    if (behaviors.length <= 0) return toCreate;
    const behavior = behaviors.shift();
    if (!(await this.findExistingGuidance(behavior.behaviorid, customerId))) {
      toCreate.push(behavior);
    }
    return await this.filterToCreate(behaviors, toCreate, customerId);
  }

  async execute(customerId: string): Promise<GuidanceDTO[]> {
    const behaviors = await this.filterBehaviorToSend();

    const toCreate = await this.filterToCreate(behaviors, [], customerId);

    const created = await Promise.all(
      toCreate.map(({ behaviorid }) =>
        this.createGuidance.execute({
          behaviorId: behaviorid,
          customerId,
          responsibleId: customerId,
        }),
      ),
    );
    return created;
  }
}
