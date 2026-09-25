import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { PmtilesClipperService } from './pmtiles-clipper.service.js';
import { CreatePmtilesClipDto } from './dto/create-pmtiles-clip.dto.js';
//import { UpdatePmtilesClipDto } from './dto/update-pmtiles-clip.dto.js';
import { ApiBody, ApiOperation, ApiParam, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('PMTiles basemaps clipper')
@Controller('pmtiles-basemaps-clipper')
export class PmtilesClipperController {
  constructor(private readonly pmtilesClipperService: PmtilesClipperService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Clip PMTiles archive by Bounding Box',
    description:
      'Extracts global low-zoom base tiles (<=5) and regional high-zoom tiles (>=6) based on a bounding box, merges them into a output file, and exposes it immediately in Martin.',
  })
  @ApiResponse({
    status: 201,
    description: 'PMTiles dataset clipped and saved to shared Martin folder.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error in bounding box or dataset name.',
  })
  @ApiResponse({
    status: 404,
    description: 'Source PMTiles file not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error executing PMTiles CLI extract or merge commands.',
  })
  create(@Body() @Body() dto: CreatePmtilesClipDto) {
    return this.pmtilesClipperService.createClip(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all clipped PMTiles files',
    description:
      'Scans the pmtiles dynamic mounted folder and returns metadata and Martin endpoint URLs for all existing clipped PMTiles files.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of clipped PMTiles files retrieved successfully.',
  })
  async findAll() {
    return this.pmtilesClipperService.findAllClips();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pmtilesClipperService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePmtilesClipperDto: UpdatePmtilesClipDto) {
  //   return this.pmtilesClipperService.update(+id, updatePmtilesClipperDto);
  // }

  @Delete(':name')
  @ApiOperation({
    summary: 'Delete a clipped PMTiles file',
    description:
      'Removes a clipped PMTiles file from the pmtiles dynamic folder. Martin will unregister it automatically on its next reload interval.',
  })
  @ApiParam({
    name: 'name',
    description: 'Name of the PMTiles dataset to remove (e.g. "madrid_center" or "madrid_center.pmtiles")',
    example: 'madrid_center',
  })
  @ApiResponse({
    status: 200,
    description: 'PMTiles file deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'PMTiles file not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error deleting the file from disk.',
  })
  async remove(@Param('name') name: string) {
    return this.pmtilesClipperService.removeClip(name);
  }
}
