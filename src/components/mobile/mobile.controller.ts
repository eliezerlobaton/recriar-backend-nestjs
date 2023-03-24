import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom, map } from 'rxjs';
import { configService } from 'src/config/config.service';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { route } from './enum/route.enum';
import { MobileServiceInterface } from './interfaces/mobile.service.interface';

@ApiTags('Mobile')
@Controller('mobile')
export class MobileController {
  private readonly indicatorsUrl = `${configService.getLokiUrl()}mobile/indicators`;
  constructor(
    @Inject('MobileServiceInterface')
    private readonly mobileService: MobileServiceInterface,
    private readonly httpService: HttpService,
  ) {}

  @Get('indicator/:customerid')
  async getIndicatorsByCostumer(
    @Param('customerid') customerid: string,
    @Query() queryParams: BaseQueryParametersDTO,
  ) {
    const result = await this.mobileService.findIndicatorsByCustomer(
      customerid,
      queryParams,
    );
    const lokiResult = await this.loki(customerid);

    const indicators = lokiResult.data.map((indicator) => {
      indicator.route = route.indicator;
      return indicator;
    });
    result.items = [...result.items, ...indicators];
    return result;
  }

  private loki(customerid): Promise<any> {
    return lastValueFrom(
      this.httpService
        .get(`${this.indicatorsUrl}/${customerid}`)
        .pipe(map((response) => response.data)),
    );
  }
}
