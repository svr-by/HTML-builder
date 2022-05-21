const { promises, createWriteStream} = require('fs');
const { join, extname } = require('path');

async function createBundle(srcPath, destPath) {

  let bundlePath = join(destPath, '/bundle.css');
  let bundleStream = createWriteStream(bundlePath);

  let styles = await promises.readdir(srcPath);

  for (let file of styles) {
    let filePath = join(srcPath, file);
    let statFile = await promises.stat(filePath);
    if (statFile.isFile() && extname(file) === '.css') {
      let bundleArr = [];
      let fd = await promises.open(filePath);
      let stream = fd.createReadStream({encoding: 'utf8'});
      stream.on('data', chunk => bundleArr.push(chunk));
      stream.on('close', () => bundleArr.forEach(chunk => bundleStream.write(chunk)));
    }
  }
}

try {
  const stylesPath = join(__dirname, '/styles');
  const bundlePath = join(__dirname, '/project-dist');
  createBundle(stylesPath, bundlePath);
} catch (err) {
  console.error(err.message);
}