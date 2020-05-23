const fs = require('fs').promises;
const { join } = require('path');

async function writeServiceOutput(name, data) {
  await fs.writeFile(
    join(__dirname, `/__test/${name}.test.json`),
    JSON.stringify(data),
  );
}

module.exports = writeServiceOutput;
