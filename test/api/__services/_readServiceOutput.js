const fs = require('fs').promises;

async function _readServiceOutput(name) {
  const data = await fs.readFile(
    `/usr/src/app/src/api/services/__test/${name}.test.json`,
    { encoding: 'utf8' },
  );

  await fs.writeFile(
    `/usr/src/app/src/api/services/__test/${name}.test.json`,
    JSON.stringify({}),
  );

  return JSON.parse(data);
}

module.exports = _readServiceOutput;
