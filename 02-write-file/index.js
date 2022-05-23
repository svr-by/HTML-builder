const { join } = require('path');
const { createWriteStream } = require('fs');
const { stdin, stdout, exit } = require('process');
const { createInterface } = require('readline');

try {
  const filePath = join(__dirname, '/text.txt');
  const output = createWriteStream(filePath);
  const rl = createInterface({input: stdin, output: stdout});

  stdout.write('Hi! Please enter the text to write to the file:\n');

  rl.on('line', text => {
    if (text === 'exit') {
      stdout.write('Goodbuy!\n');
      exit();
    }
    output.write(`${text}\n`);
  });

  rl.on('close', () => {
    stdout.write('Goodbuy!\n');
    exit();
  });
} catch (err) {
  console.error(err.message);
}