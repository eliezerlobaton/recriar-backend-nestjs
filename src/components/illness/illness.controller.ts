import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateIllnessDto } from './dto/create-illness.dto';
import { UpdateIllnessDto } from './dto/update-illness.dto';
import { DeleteIllnessDTO } from './dto/delete-illness.dto';
import { IllnessService } from './illness.service';

@Controller('illness')
export class IllnessController {
  constructor(private readonly illnessService: IllnessService) {}

  @Post()
  create(@Body() createIllnessDto: CreateIllnessDto) {
    return this.illnessService.create(createIllnessDto);
  }

  @Get()
  findAll() {
    return this.illnessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.illnessService.findOne(id);
  }

  @Put()
  update(@Body() updateIllnessDto: UpdateIllnessDto) {
    return this.illnessService.update(updateIllnessDto);
  }

  @Delete()
  delete(@Body() deleteIllnessDTO: DeleteIllnessDTO) {
    return this.illnessService.delete(deleteIllnessDTO.id);
  }
}
