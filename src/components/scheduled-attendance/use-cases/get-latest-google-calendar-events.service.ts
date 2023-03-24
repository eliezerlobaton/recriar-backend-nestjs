import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { configService } from 'src/config/config.service';
import { AuthenticateGoogleApi } from './authenticate-google-api.service';

@Injectable()
export class GetLatestGoogleCalendarEvents {
  constructor(private readonly getAuth: AuthenticateGoogleApi) {}

  private getUpdatedMin(): string {
    const date = new Date();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds() - 10,
    ).toISOString();
  }

  async run() {
    const calendar = google.calendar({
      version: 'v3',
      auth: await this.getAuth.run(),
    });

    const event = await calendar.events.list({
      calendarId: configService.google.calendar.getId(),
      updatedMin: this.getUpdatedMin(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return event.data.items;
  }
}
