export class LimesurveyBaseResponseDTO<ResultType> {
  id: number;
  result: ResultType;
  error: any;
}
