import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { configService } from 'src/config/config.service';
import { LokiIntegrationApiServiceInterface } from '../interfaces/loki-integration-api.service.interface';

@Injectable()
export class LokiIntegrationApiService
  implements LokiIntegrationApiServiceInterface
{
  constructor(private readonly httpService: HttpService) {}
  async integrate(mailChimpId: string, limesurveyId: string): Promise<any> {
    const integrationBody = {
      mailChimp: mailChimpId,
      limesurvey: limesurveyId,
    };
    return lastValueFrom(
      this.httpService
        .post<any>(
          `${configService.getLokiUrl()}integration/mailchimp_limesurvey`,
          integrationBody,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(map((response) => response.data)),
    );
  }
}
