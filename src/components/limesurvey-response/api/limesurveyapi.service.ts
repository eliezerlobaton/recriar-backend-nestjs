import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { LimesurveyBaseResponseDTO } from 'src/components/shared/dto/limesurvey-base-response.dto';
import { LimesurveyBodyDTO } from 'src/components/shared/dto/limesurvey-body.dto';
import { LimesurveyApiServiceInterface } from 'src/components/shared/interfaces/limesurveyapi.service.interface';
import { decodeBase64 } from 'src/components/shared/lib/common-functions';
import { configService } from 'src/config/config.service';

@Injectable()
export class LimesurveyApi implements LimesurveyApiServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  private async limesurveyRemoteControl(
    data: LimesurveyBodyDTO,
  ): Promise<LimesurveyBaseResponseDTO<any>> {
    return lastValueFrom(
      this.httpService
        .post<LimesurveyBaseResponseDTO<any>>(
          configService.getLimesurveyUrl(),
          JSON.stringify(data),
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

  private async getSessionKey(): Promise<any> {
    const { result: key, error }: { result: string; error: any } =
      await this.limesurveyRemoteControl({
        method: 'get_session_key',
        params: [
          configService.getLimesurveyUser(),
          configService.getLimesurveyPassword(),
        ],
        id: 1,
      });

    if (key.toLocaleLowerCase().includes('invalid') || error !== null) {
      throw new ForbiddenException('Invalid Limesurvey Credentials');
    }

    return key;
  }

  async getSurveyResponses(
    surveyId: number,
    questionFormat: 'full' | 'code' | 'abbreviated',
    responseFormat: 'short' | 'long',
  ): Promise<any[]> {
    const { result } = await this.limesurveyRemoteControl({
      method: 'export_responses',
      params: [
        await this.getSessionKey(),
        surveyId,
        'json',
        null,
        'complete',
        questionFormat,
        responseFormat,
      ],
      id: 1,
    });

    if (result?.status) {
      return [];
    }

    const { responses } = decodeBase64(result);
    return responses;
  }
}
