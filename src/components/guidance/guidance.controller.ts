import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Inject,
  Headers,
} from '@nestjs/common';
import { CreateGuidanceDto } from './dto/create-guidance.dto';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { ResendGuidanceDTO } from './dto/resend-guidance.dto';
import { GuidanceQueryParametersDTO } from './dto/guidance-query-parameters.dto';
import { GuidanceServiceInterface } from './interfaces/guidance.service.interface';
import { ApiTags } from '@nestjs/swagger';
import { GuidanceDTO } from './dto/guidance.dto';
import { GetBaseResponseDTO } from '../shared/dto/base-get-response.dto';

@ApiTags('Guidance')
@Controller('guidance')
export class GuidanceController {
  constructor(
    @Inject('GuidanceServiceInterface')
    private readonly guidanceService: GuidanceServiceInterface,
  ) {}

  @Post('/behavior')
  send(
    @Headers() headers: { authorization: string },
    @Body() createGuidanceDto: CreateGuidanceDto,
  ) {
    if (headers?.authorization) {
      createGuidanceDto.sentBy = headers.authorization.split(' ').pop();
    }
    return this.guidanceService.create(createGuidanceDto);
  }

  @Post('/behavior/resend')
  resend(
    @Headers() headers: { authorization: string },
    @Body() resendGuidanceDto: ResendGuidanceDTO,
  ) {
    if (headers?.authorization) {
      resendGuidanceDto.sentBy = headers.authorization.split(' ').pop();
    }
    return this.guidanceService.resend(resendGuidanceDto);
  }

  @Get('/behavior/customer/:customerid')
  async findByCostumer(
    @Param('customerid') customerId: string,
    @Query() queryParams: GuidanceQueryParametersDTO,
  ) {
    const guidances = await this.guidanceService.findAllByCustomer(
      customerId,
      queryParams,
    );
    return guidances;
  }

  @Get('/behavior/:id')
  async findById(@Param('id') guidanceId: string): Promise<GuidanceDTO> {
    return this.guidanceService.findOneById(guidanceId);
  }

  @Get('/behavior/history/:guidanceid')
  async findHistoryById(
    @Param('guidanceid') guidanceId: string,
  ): Promise<GuidanceDTO> {
    return this.guidanceService.findOneHistoryById(guidanceId);
  }

  @Get('/behavior/customer/:customerid/history')
  async findAll(
    @Param('customerid') customerId: string,
    @Query() queryParams: GuidanceQueryParametersDTO,
  ): Promise<GetBaseResponseDTO<GuidanceDTO[]>> {
    return this.guidanceService.findAllHistoriesByCustomer(
      customerId,
      queryParams,
    );
  }

  @Put()
  async update(@Body() updateGuidanceDto: UpdateGuidanceDto) {
    const guidance = await this.guidanceService.update(updateGuidanceDto);
    return guidance;
  }

  @Get('/responsible/:responsibleid')
  async findByResponsible(
    @Param('responsibleid') responsibleId: string,
    @Query() queryParams: GuidanceQueryParametersDTO,
  ) {
    const guidances = await this.guidanceService.findAllByCustomerAndReponsible(
      responsibleId,
      responsibleId,
      queryParams,
    );
    return guidances;
  }

  @Get('/results/images')
  async findAllImages() {
    const files = await this.guidanceService.listGuidanceResultImages();
    return files;
  }
}
