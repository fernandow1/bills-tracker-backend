const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const sql = execSync('npx @ariga/atlas-provider-typeorm load --dialect mysql --path ./dist/infrastructure/database/entities', { encoding: 'utf8' });
  const tmpFile = path.join(process.cwd(), 'schema.sql');
  fs.writeFileSync(tmpFile, sql);
  console.log(JSON.stringify({ url: `file://${tmpFile}` }));
} catch (e) {
  console.error(e);
  process.exit(1);
}
