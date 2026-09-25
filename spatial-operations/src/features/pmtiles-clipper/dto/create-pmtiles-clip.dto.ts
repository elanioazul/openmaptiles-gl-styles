import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PmtilesDistro } from '../enums/pmtiles-distro.enum.js';


export class CreatePmtilesClipDto {
@ApiProperty({
    description: 'Output name for the clipped PMTiles file (alphanumeric, hyphens, underscores)',
    example: 'spain_madrid_region',
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Name can only contain letters, numbers, underscores, and hyphens',
  })
  name: string;

  @ApiProperty({
    description: 'Bounding box array [minX, minY, maxX, maxY]',
    example: [-3.75, 40.38, -3.65, 40.48],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsNumber({}, { each: true })
  bbox: [number, number, number, number];

  @ApiProperty({
    description: 'Source distribution to clip from',
    enum: PmtilesDistro,
    example: PmtilesDistro.PLANETILER,
    required: false,
    default: PmtilesDistro.PLANETILER,
  })
  @IsOptional()
  @IsEnum(PmtilesDistro)
  distro?: PmtilesDistro = PmtilesDistro.PLANETILER;
}
