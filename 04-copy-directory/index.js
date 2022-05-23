const { join } = require('path');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');

async function copyDir(srcPath, destPath) {
  await rm(destPath, { force: true, recursive: true});
  console.log('Files copied');
  await mkdir(destPath, {recursive: true});

  let inners = await readdir(srcPath, {withFileTypes: true});
  for (const inner of inners) {
    if (inner.isFile()) {
      await copyFile(join(srcPath, inner.name), join(destPath, inner.name));
    } else if (inner.isDirectory()) {
      copyDir(join(srcPath, inner.name), join(destPath, inner.name));
    }
  }
}

try {
  const filesDirPath = join(__dirname, '/files');
  const newDirPath = join(__dirname, '/files-copy');
  copyDir(filesDirPath, newDirPath).catch((err) => console.error(err.message));

} catch (err) {
  console.error(err.message);
}