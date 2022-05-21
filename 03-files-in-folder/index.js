const { join, extname, basename } = require('path');
const { readdir, stat } = require('fs/promises');

async function showFiles(path) {
  let files = await readdir(path);
  for (const file of files) {
    let statFile = await stat(join(path, file));
    if (statFile.isFile()) {
      let ext = extname(file);
      let name = basename(file, ext);
      let size = (statFile.size / 1024).toFixed(3);
      let result = `${name} - ${ext.slice(1)} - ${size}kb`;
      console.log(result);
    }
  }
}

try {
  const pathDir = join(__dirname, '/secret-folder');
  showFiles(pathDir);
} catch (err) {
  console.error(err.message);
}
