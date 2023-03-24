export class LimesurveyBodyDTO {
  method:
    | 'get_session_key'
    | 'export_responses'
    | 'list_surveys'
    | 'list_questions'
    | 'list_groups';
  params: any[];
  id: number;
}
