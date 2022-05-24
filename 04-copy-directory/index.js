const { join } = require('path');
const { mkdir, unlink, stat, readdir, copyFile } = require('fs/promises');

async function deleteFiles(path) {
  let inners = await readdir(path, {withFileTypes: true});
  for (const inner of inners) {
    if (inner.isFile()) {
      await unlink(join(path, inner.name));
    } else if (inner.isDirectory()) {
      deleteFiles(join(path, inner.name));
    }
  }
}

async function copyDir(srcPath, destPath) {
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

async function updateDir(srcPath, destPath) {
  let statDir = await stat(destPath).catch(() => null);
  if (statDir) await deleteFiles(destPath).catch((err) => console.error('deleteFiles:', err.message));
  await copyDir(srcPath, destPath).catch((err) => console.error('copyDir:', err.message));
}


try {
  const filesDirPath = join(__dirname, '/files');
  const newDirPath = join(__dirname, '/files-copy');
  updateDir(filesDirPath, newDirPath).catch((err) => console.error('updateDir:', err.message));

} catch (err) {
  console.error(err.message);
}