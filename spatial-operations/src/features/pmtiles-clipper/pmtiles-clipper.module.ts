import { Module } from '@nestjs/common';
import { PmtilesClipperService } from './pmtiles-clipper.service.js';
import { PmtilesClipperController } from './pmtiles-clipper.controller.js';

@Module({
  controllers: [PmtilesClipperController],
  providers: [PmtilesClipperService],
})
export class PmtilesClipperModule {}
