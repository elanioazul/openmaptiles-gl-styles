import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PmtilesClipperService } from './pmtiles-clipper.service.js';
import { CreatePmtilesClipperDto } from './dto/create-pmtiles-clipper.dto.js';
import { UpdatePmtilesClipperDto } from './dto/update-pmtiles-clipper.dto.js';
import { ApiBody, ApiOperation, ApiParam, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('PMTiles clipper')
@Controller('pmtiles-clipper')
export class PmtilesClipperController {
  constructor(private readonly pmtilesClipperService: PmtilesClipperService) {}

  @Post()
  create(@Body() createPmtilesClipperDto: CreatePmtilesClipperDto) {
    return this.pmtilesClipperService.create(createPmtilesClipperDto);
  }

  @Get()
  findAll() {
    return this.pmtilesClipperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pmtilesClipperService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePmtilesClipperDto: UpdatePmtilesClipperDto) {
    return this.pmtilesClipperService.update(+id, updatePmtilesClipperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pmtilesClipperService.remove(+id);
  }
}
