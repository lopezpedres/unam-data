const fs = require('fs');
const path = require('path');

// links obtained from https://web.archive.org/web/*/http://www.dgae.unam.mx*

// Note: ./data is gitignored, download the archive links to ./data/archive-links.json
// read ./data/archive-links.json
const jsonPath = path.join(__dirname, './data/archive-links.json');
const csvPath = path.join(__dirname, './data/archive-links.csv');
const archiveLinks = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const result = [];
const termSegments = [];
// loop through archive-links.json
for (let i = 0; i < archiveLinks.length; i++) {
  // skip first row
  if (i === 0) {
    continue;
  }
  // original,mimetype,timestamp,endtimestamp,groupcount,uniqcount
  const row = archiveLinks[i];
  const original = row[0];

  // append to result if original contains 'resultados'
  if (original.indexOf('resultados') > -1) {
    result.push(row);

    // split original path into segments
    const segments = original.split('/');
    // Example: http://www.dgae.unam.mx:80/Abril2002/resultados/3/3050075.html
    // Get the Abril2002 segment which is the 3rd segment
    const term = segments[3];
    // if term is not in termSegments, add it
    if (termSegments.indexOf(term) === -1) {
      termSegments.push(term);
    }
    // append to ./data/archive-links.csv
    fs.appendFileSync(csvPath, archiveLinks[i].join(',') + '\n');
  }
}