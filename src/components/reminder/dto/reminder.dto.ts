export class ReminderDto {
  id: string;
  customer: { id: string; name: string };
  squadUser: { id: string; name: string };
  reminder: string;
  lastModificatioDate: Date;
  creationDate: Date;
}
