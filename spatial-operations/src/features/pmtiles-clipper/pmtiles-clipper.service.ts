import { Injectable } from '@nestjs/common';
import { CreatePmtilesClipperDto } from './dto/create-pmtiles-clipper.dto.js';
import { UpdatePmtilesClipperDto } from './dto/update-pmtiles-clipper.dto.js';

@Injectable()
export class PmtilesClipperService {
  create(createPmtilesClipperDto: CreatePmtilesClipperDto) {
    return 'This action adds a new pmtilesClipper';
  }

  findAll() {
    return `This action returns all pmtilesClipper`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pmtilesClipper`;
  }

  update(id: number, updatePmtilesClipperDto: UpdatePmtilesClipperDto) {
    return `This action updates a #${id} pmtilesClipper`;
  }

  remove(id: number) {
    return `This action removes a #${id} pmtilesClipper`;
  }
}
