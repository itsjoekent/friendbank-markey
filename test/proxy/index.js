const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const app = express();

app.use(express.json());

app.all('*', async function(req, res) {
  res.send('ok');
});

app.listen(process.env.PORT, () => console.log(`bsd proxy listening on ${process.env.PORT}`));
