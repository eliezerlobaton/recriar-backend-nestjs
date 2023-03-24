export interface IntegrationSchedulerServiceInterface {
  integrateLimesurveyResponses(): Promise<void>;
  integrateMailChimpLimesurvey(): Promise<void>;
}
