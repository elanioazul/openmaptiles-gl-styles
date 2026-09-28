import { Module } from '@nestjs/common';
import { PmtilesClipperModule } from './features/pmtiles-clipper/pmtiles-clipper.module.js';

@Module({
  imports: [PmtilesClipperModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
