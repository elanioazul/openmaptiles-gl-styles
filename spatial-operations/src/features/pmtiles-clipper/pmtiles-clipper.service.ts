import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CreatePmtilesClipDto } from './dto/create-pmtiles-clip.dto.js';
//import { UpdatePmtilesClipDto } from './dto/update-pmtiles-clip.dto.js';
import { sourcePaths, outputDir, tempDir } from './consts/mounted-directories.js';
import { PmtilesDistro } from './enums/pmtiles-distro.enum.js';
import { martinBaseUrl, martinCatalog } from './consts/endpoints.js';

const execFileAsync = promisify(execFile)

@Injectable()
export class PmtilesClipperService implements OnModuleInit {

  async onModuleInit() {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(tempDir, { recursive: true });
  }

  async createClip(dto: CreatePmtilesClipDto) {
    const distro = dto.distro ?? PmtilesDistro.PLANETILER;
    const sourceFile = sourcePaths[distro];

    // Ensure source pmtiles archive exists
    try {
      await fs.access(sourceFile);
    } catch {
      throw new NotFoundException(
        `Source PMTiles archive for '${distro}' not found at ${sourceFile}`,
      );
    }

    const bboxString = dto.bbox.join(',');
    const sanitizedName = dto.name.replace(/[^a-zA-Z0-9_-]/g, '');
    const timestamp = Date.now();

    const tempLow = path.join(tempDir, `${sanitizedName}_low_${timestamp}.pmtiles`);
    const tempHigh = path.join(tempDir, `${sanitizedName}_high_${timestamp}.pmtiles`);
    const finalOutputFile = path.join(outputDir, `${sanitizedName}.pmtiles`);

    try {
      // Step 1: Extract global low-resolution base
      await execFileAsync('pmtiles', [
        'extract',
        sourceFile,
        tempLow,
        '--maxzoom=5',
      ]);

      // Step 2: Extract high-resolution regional details for bounding box
      await execFileAsync('pmtiles', [
        'extract',
        sourceFile,
        tempHigh,
        '--minzoom=6',
        `--bbox=${bboxString}`,
        '--download-threads=8',
      ]);

      // Step 3: Merge low + high zoom archives into the shared Martin directory
      await execFileAsync('pmtiles', [
        'merge',
        tempLow,
        tempHigh,
        finalOutputFile,
      ]);

      return {
        statusCode: 201,
        message: 'PMTiles extracted and merged successfully',
        outputFile: `${sanitizedName}.pmtiles`,
        catalogUrl: `${martinCatalog}`,
        martinTileSource: `${sanitizedName}`,
        martinTileEndpoint: `${martinBaseUrl}/${sanitizedName}`,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `PMTiles processing failed: ${error.stderr || error.message}`,
      );
    } finally {
      // Clean up temporary intermediate files
      await Promise.allSettled([
        fs.unlink(tempLow).catch(() => {}),
        fs.unlink(tempHigh).catch(() => {}),
      ]);
    }
  }

  async findAllClips() {
    try {
      const files = await fs.readdir(outputDir);
      const pmtilesFiles = files.filter((file) => file.endsWith('.pmtiles'));

      const fileDetails = await Promise.all(
        pmtilesFiles.map(async (file) => {
          const sanitizedName = path.parse(file).name;
          const filePath = path.join(outputDir, file);
          const stats = await fs.stat(filePath);

          return {
            outputFile: file,
            martinTileSource: sanitizedName,
            catalogUrl: `${martinCatalog}`,
            martinTileEndpoint: `${martinBaseUrl}/${sanitizedName}`,
            sizeBytes: stats.size,
            createdAt: stats.birthtime,
          };
        }),
      );

      return {
        statusCode: 200,
        message: 'Clipped PMTiles files retrieved successfully',
        count: fileDetails.length,
        files: fileDetails,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to scan PMTiles directory: ${error.message}`,
      );
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} pmtilesClipper`;
  // }

  // update(id: number, updatePmtilesClipperDto: UpdatePmtilesClipDto) {
  //   return `This action updates a #${id} pmtilesClipper`;
  // }

  async removeClip(name: string) {
    const sanitizedName = name.replace(/\.pmtiles$/i, '').replace(/[^a-zA-Z0-9_-]/g, '');
    const fileName = `${sanitizedName}.pmtiles`;
    const filePath = path.join(outputDir, fileName);

    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundException(`PMTiles file '${fileName}' not found`);
    }

    try {
      await fs.unlink(filePath);

      return {
        statusCode: 200,
        message: 'PMTiles file deleted successfully',
        deletedFile: fileName,
        martinTileSource: sanitizedName,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to delete PMTiles file: ${error.message}`,
      );
    }
  }
}
