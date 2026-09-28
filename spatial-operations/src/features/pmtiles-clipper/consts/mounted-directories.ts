import { PmtilesDistro } from "../enums/pmtiles-distro.enum.js";

export const sourcePaths = {
    [PmtilesDistro.PLANETILER]: '/mounted_data/pmtiles/sp-planetiler/sp-osm.pmtiles',
    [PmtilesDistro.PROTOMAPS]: '/mounted_data/pmtiles/sp-protomaps/sp_protomaps.pmtiles',
  };

export const outputDir = '/mounted_data/pmtiles/dynamic';
export const tempDir = '/tmp/pmtiles-work';