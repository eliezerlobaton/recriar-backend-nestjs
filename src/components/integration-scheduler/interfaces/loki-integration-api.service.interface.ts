export interface LokiIntegrationApiServiceInterface {
  integrate(mailChimpId: string, limesurveyId: string): Promise<any>;
}
