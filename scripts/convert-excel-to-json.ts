#!/usr/bin/env ts-node

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { TvGuideJSON, TvGuideRow, TZ } from '../src/types/tvguide';

interface ConvertOptions {
  excel: string;
  channelId: string;
  regions: string;
  tzMap: string;
  out: string;
}

function parseArgs(): ConvertOptions {
  const args = process.argv.slice(2);
  const options: Partial<ConvertOptions> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    
    if (key && value) {
      // Map kebab-case to camelCase
      const mappedKey = key === 'tz-map' ? 'tzMap' : key;
      (options as any)[mappedKey] = value;
    }
  }

  // Validate required options
  const required = ['excel', 'channelId', 'regions', 'tzMap', 'out'];
  for (const req of required) {
    if (!options[req as keyof ConvertOptions]) {
      console.error(`Missing required option: --${req}`);
      process.exit(1);
    }
  }

  return options as ConvertOptions;
}

function validateColumns(worksheet: XLSX.WorkSheet): void {
  const expectedColumns = [
    'Region',
    'Date',
    'Start Time',
    'End Time',
    'Title',
    'Season',
    'Episode',
    'Subtitle',
    'Text Color',
    'BG Color',
    'Timezone'
  ];

  const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
  
  for (const expected of expectedColumns) {
    if (!headers.includes(expected)) {
      console.error(`Missing required column: ${expected}`);
      console.error(`Found columns: ${headers.join(', ')}`);
      process.exit(1);
    }
  }
}

function parseTimeMap(tzMapStr: string): Record<string, TZ[]> {
  try {
    const parsed = JSON.parse(tzMapStr);
    
    // Validate TZ values
    const validTZs: TZ[] = ['WAT', 'CAT', 'EST'];
    for (const [region, tzs] of Object.entries(parsed)) {
      if (!Array.isArray(tzs)) {
        throw new Error(`Timezone map for ${region} must be an array`);
      }
      for (const tz of tzs as string[]) {
        if (!validTZs.includes(tz as TZ)) {
          throw new Error(`Invalid timezone: ${tz}. Must be one of: ${validTZs.join(', ')}`);
        }
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('Invalid timezone map JSON:', error);
    process.exit(1);
  }
}

function convertExcelToJSON(options: ConvertOptions): void {
  const { excel, channelId, regions, tzMap, out } = options;
  
  // Check if Excel file exists
  if (!fs.existsSync(excel)) {
    console.error(`Excel file not found: ${excel}`);
    process.exit(1);
  }

  // Read Excel file
  const workbook = XLSX.readFile(excel);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Validate columns
  validateColumns(worksheet);

  // Convert to JSON
  const rows = XLSX.utils.sheet_to_json(worksheet) as TvGuideRow[];

  // Parse regions and timezone map
  const regionsList = regions.split(',').map(r => r.trim());
  const timezonesByRegion = parseTimeMap(tzMap);

  // Validate that all regions in the data are in the regions list
  const dataRegions = [...new Set(rows.map(row => row.Region))];
  for (const region of dataRegions) {
    if (!regionsList.includes(region)) {
      console.warn(`Warning: Region "${region}" found in data but not in regions list`);
    }
  }

  // Validate that all regions in the list have timezone mappings
  for (const region of regionsList) {
    if (!timezonesByRegion[region]) {
      console.error(`Missing timezone mapping for region: ${region}`);
      process.exit(1);
    }
  }

  // Create the final JSON structure
  const result: TvGuideJSON = {
    channelId,
    regions: regionsList,
    timezonesByRegion,
    rows
  };

  // Ensure output directory exists
  const outDir = path.dirname(out);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Write output file
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  
  console.log(`✅ Successfully converted ${excel} to ${out}`);
  console.log(`📊 Processed ${rows.length} rows`);
  console.log(`🌍 Regions: ${regionsList.join(', ')}`);
  console.log(`⏰ Timezones: ${Object.entries(timezonesByRegion).map(([r, tzs]) => `${r}: ${tzs.join(',')}`).join('; ')}`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('convert-excel-to-json.ts')) {
  const options = parseArgs();
  convertExcelToJSON(options);
}
