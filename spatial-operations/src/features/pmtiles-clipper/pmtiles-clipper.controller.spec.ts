import { Test, TestingModule } from '@nestjs/testing';
import { PmtilesClipperController } from './pmtiles-clipper.controller.js';
import { PmtilesClipperService } from './pmtiles-clipper.service.js';

describe('PmtilesClipperController', () => {
  let controller: PmtilesClipperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmtilesClipperController],
      providers: [PmtilesClipperService],
    }).compile();

    controller = module.get<PmtilesClipperController>(PmtilesClipperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
