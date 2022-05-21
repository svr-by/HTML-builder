const { join } = require('path');
const { mkdir, readdir, stat, copyFile } = require('fs/promises');

async function copyDir(srcPath, destPath) {
  await mkdir(destPath, {recursive: true});
  let inners = await readdir(srcPath);
  for (const inner of inners) {
    let statInner = await stat(join(srcPath, inner));
    if (statInner.isFile()) {
      await copyFile(join(srcPath, inner), join(destPath, inner));
    } else if (statInner.isDirectory()) {
      copyDir(join(srcPath, inner), join(destPath, inner));
    }
  }
}

try {
  const filesDirPath = join(__dirname, '/files');
  const newDirPath = join(__dirname, '/files-copy');
  copyDir(filesDirPath, newDirPath);
} catch (err) {
  console.error(err.message);
}