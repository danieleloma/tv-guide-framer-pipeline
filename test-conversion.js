const XLSX = require('xlsx');
const fs = require('fs');

// Read the CSV file
const workbook = XLSX.readFile('data/test-sample.csv');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet);

console.log('CSV data:', rows);

// Create the JSON structure
const result = {
  channelId: 'test-channel',
  regions: ['Test Region'],
  timezonesByRegion: {
    'Test Region': ['CAT']
  },
  rows: rows
};

// Write output file
fs.writeFileSync('data/test-output.json', JSON.stringify(result, null, 2));
console.log('✅ Successfully created test-output.json');
