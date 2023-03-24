import { GetBaseResponseDTO } from 'src/components/shared/dto/base-get-response.dto';
import { CreateGuidanceDto } from '../dto/create-guidance.dto';
import { GuidanceQueryParametersDTO } from '../dto/guidance-query-parameters.dto';
import { GuidanceDTO } from '../dto/guidance.dto';
import { ResendGuidanceDTO } from '../dto/resend-guidance.dto';
import { SaveResultDTO } from '../dto/save-result.dto';
import { UpdateGuidanceDto } from '../dto/update-guidance.dto';

export interface GuidanceServiceInterface {
  create(createGuidanceDto: CreateGuidanceDto): Promise<GuidanceDTO>;
  update(updateGuidanceDto: UpdateGuidanceDto): Promise<GuidanceDTO>;
  resend(resendGuidanceDto: ResendGuidanceDTO): Promise<GuidanceDTO>;
  findOneById(guidanceId: string): Promise<GuidanceDTO>;
  findAllByCustomer(
    customerId: string,
    queryParams: GuidanceQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<GuidanceDTO[]>>;
  findAllHistoriesByCustomer(
    customerId: string,
    queryParams: GuidanceQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<GuidanceDTO[]>>;
  findOneHistoryById(guidanceId: string): Promise<GuidanceDTO>;
  findAllByCustomerAndReponsible(
    customerId: string,
    reponsibleId: string,
    queryParams: GuidanceQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<GuidanceDTO[]>>;
  listGuidanceResultImages(): Promise<any[]>;
  saveResult(saveResultDto: SaveResultDTO): Promise<GuidanceDTO>;
}
