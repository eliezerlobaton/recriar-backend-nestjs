import { IntegrateResponseDTO } from '../dto/integrate-response.dto';

export interface LimesurveyResponseServiceInterface {
  getAllSurveyResponses(surveyId: number): Promise<any[]>;
  integrateResponses(surveyId: number): Promise<IntegrateResponseDTO>;
}
