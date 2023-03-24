import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { configService } from 'src/config/config.service';
import { AuthenticateGoogleApi } from './authenticate-google-api.service';
import { UseCase } from 'src/components/shared/interfaces/use-case.interface';
import { DeleteWatcherDto } from '../dto/delete-watcher.dto';

@Injectable()
export class DeleteEventWatcherUseCase implements UseCase<any> {
  constructor(private readonly auth: AuthenticateGoogleApi) {}

  async execute(deleteWatcherDto: DeleteWatcherDto): Promise<any> {
    const auth = await this.auth.run();
    const calendar = google.calendar({ version: 'v3', auth });
    const response = await calendar.channels.stop({
      requestBody: deleteWatcherDto,
    });
    return response;
  }
}
