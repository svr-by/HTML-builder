const { join } = require('path');
const { createReadStream } = require('fs');

const pathFileTxt = join(__dirname, '/text.txt');
const input = createReadStream(pathFileTxt, 'utf8');

let output = '';

input.on('data', chunk => output += chunk);
input.on('end', () => console.log(output));
input.on('error', error => console.log(error.message));