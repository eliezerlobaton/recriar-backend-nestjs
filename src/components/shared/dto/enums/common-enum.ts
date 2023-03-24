export enum ContentType {
  General = 'General',
  Specific = 'Specific',
}

export enum TranslatedContentType {
  Geral = <any>'General',
  Especifico = <any>'Specific',
}

export enum KnowledgeType {
  General = 'General',
  Specific = 'Specific',
}

export enum KnowledgeSubmissionStatus {
  Pending = 'Pending',
  Measured = 'Measured',
  NotInterested = 'NotInterested',
}

export enum ContentSubmissionStatus {
  NotRead = 'NotRead',
  Read = 'Read',
  NotInteracted = 'NotInteracted',
}

export enum RateType {
  Empty = '',
  Unknown = 'unknown',
  VeryBad = 'verybad',
  Bad = 'bad',
  Average = 'average',
  Good = 'good',
  Excellent = 'excellent',
}

export enum Gender {
  Male = <any>'Male',
  Female = <any>'Female',
}

export enum AppStatus {
  Pending = 'Pending',
  Interacted = 'Interacted',
  NotSend = 'NotSend',
  Answered = 'Answered',
}

export enum PostgresErrorCode {
  UniqueViolation = '23505',
  CheckViolation = '23514',
  NotNullViolation = '23502',
  ForeignKeyViolation = '23503',
}

export enum SquadUserRole {
  Medic = 'Medic',
  Nurse = 'Nurse',
  Psychologist = 'Psychologist',
  Nutritionist = 'Nutritionist',
  HealthCoach = 'HealthCoach',
}
