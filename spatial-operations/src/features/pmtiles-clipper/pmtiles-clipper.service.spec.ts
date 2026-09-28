import { Test, TestingModule } from '@nestjs/testing';
import { PmtilesClipperService } from './pmtiles-clipper.service.js';

describe('PmtilesClipperService', () => {
  let service: PmtilesClipperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmtilesClipperService],
    }).compile();

    service = module.get<PmtilesClipperService>(PmtilesClipperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
