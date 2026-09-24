import { PartialType } from '@nestjs/swagger';
import { CreatePmtilesClipperDto } from './create-pmtiles-clipper.dto.js';

export class UpdatePmtilesClipperDto extends PartialType(CreatePmtilesClipperDto) {}
