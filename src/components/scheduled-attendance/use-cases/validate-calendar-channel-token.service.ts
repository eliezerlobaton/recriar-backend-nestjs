import { Injectable } from '@nestjs/common';
import { configService } from 'src/config/config.service';

@Injectable()
export class ValidateCalendarChannelToken {
  run(data: { token: string }): boolean {
    return data.token === configService.google.calendar.getWatcherToken();
  }
}
