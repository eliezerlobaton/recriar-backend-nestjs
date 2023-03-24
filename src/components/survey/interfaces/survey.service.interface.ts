import { GuidanceDTO } from 'src/components/guidance/dto/guidance.dto';

export interface SurveyServiceInterface {
  calculateResponses(): Promise<GuidanceDTO[]>;
  getLastCalculatedResponse(guidances: GuidanceDTO[]): GuidanceDTO;
}
