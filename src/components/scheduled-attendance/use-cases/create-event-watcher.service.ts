import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { configService } from 'src/config/config.service';
import { AuthenticateGoogleApi } from './authenticate-google-api.service';

@Injectable()
export class CreateEventWatcher {
  constructor(private readonly auth: AuthenticateGoogleApi) {}

  async run(urlSubscription: string) {
    const auth = await this.auth.run();
    const calendar = google.calendar({ version: 'v3', auth });
    const uuid = randomUUID();
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + 1);
    const response = await calendar.events.watch({
      calendarId: configService.google.calendar.getId(),
      requestBody: {
        token: configService.google.calendar.getWatcherToken(),
        id: uuid,
        type: 'web_hook',
        address: urlSubscription,
        params: {
          ttl: `${Math.round(
            (expiration.getTime() - new Date().getTime()) / 1000,
          )}`,
        },
      },
    });

    return response;
  }
}
