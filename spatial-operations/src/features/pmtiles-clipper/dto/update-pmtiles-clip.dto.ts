import { PartialType } from '@nestjs/swagger';
import { CreatePmtilesClipDto } from './create-pmtiles-clip.dto.js';

export class UpdatePmtilesClipDto extends PartialType(CreatePmtilesClipDto) {}
