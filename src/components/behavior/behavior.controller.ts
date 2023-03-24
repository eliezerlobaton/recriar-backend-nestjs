import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseQueryParametersDTO } from '../shared/dto/base-query-parameters.dto';
import { CreateBehaviorDTO } from './dto/create-behavior.dto';
import { DeleteBehaviorDTO } from './dto/delete-behavior.dto';
import { UpdateBehaviorDTO } from './dto/update-behavior.dto';
import { BehaviorServiceInterface } from './interfaces/behavior.service.interface';

@ApiTags('Behavior')
@Controller('behavior')
export class BehaviorController {
  constructor(
    @Inject('BehaviorServiceInterface')
    private readonly behaviorService: BehaviorServiceInterface,
  ) {}

  @Post()
  async create(@Body() createBehaviorDTO: CreateBehaviorDTO) {
    return this.behaviorService.create(createBehaviorDTO);
  }

  @Put()
  async update(@Body() updateBehaviorDTO: UpdateBehaviorDTO) {
    return this.behaviorService.update(updateBehaviorDTO);
  }

  @Get()
  async findAll(@Query() queryParams: BaseQueryParametersDTO) {
    return this.behaviorService.findAll(queryParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.behaviorService.findOne(id);
  }

  @Delete()
  async remove(@Body() deleteBehaviorDTO: DeleteBehaviorDTO) {
    return this.behaviorService.remove(deleteBehaviorDTO.id);
  }
}
