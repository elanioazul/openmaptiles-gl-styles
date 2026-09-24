import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PmtilesClipperModule } from './features/pmtiles-clipper/pmtiles-clipper.module.js';

@Module({
  imports: [PmtilesClipperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
