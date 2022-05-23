const { promises, createWriteStream} = require('fs');
const { join, extname, basename } = require('path');

async function createProjectDir(path) {
  await promises.mkdir(path, {recursive: true});
}

async function createPageLayout (srcTemplPath, srcComplPath, destPath) {
  let template = await promises.readFile(srcTemplPath, {encoding: 'utf8'});
  let componentsFiles = await promises.readdir(srcComplPath, {withFileTypes: true});
  for (const component of componentsFiles) {
    if (component.isFile()) {
      let componentInner = await promises.readFile(join(srcComplPath, component.name), {encoding: 'utf8'});
      let componentTag = `{{${basename(component.name, extname(component.name))}}}`;
      template = template.replace(componentTag, componentInner);
    }
  }
  let resultPath = join(destPath, '/index.html');
  let resultStream = createWriteStream(resultPath);
  resultStream.write(template);
}

async function createStylesBundle(srcPath, destPath) {
  let bundlePath = join(destPath, '/style.css');
  let bundleStream = createWriteStream(bundlePath);
  let styles = await promises.readdir(srcPath, {withFileTypes: true});
  styles.sort(a => (a.name === 'header.css') ? -1 : 0);
  for (let file of styles) {
    let filePath = join(srcPath, file.name);
    if (file.isFile() && extname(file.name) === '.css') {
      let bundleArr = [];
      let fd = await promises.open(filePath);
      let stream = fd.createReadStream({encoding: 'utf8'});
      stream.on('data', chunk => bundleArr.push(chunk));
      stream.on('close', () => bundleArr.forEach(chunk => bundleStream.write(chunk)));
    }
  }
}

async function copyAssets(srcPath, destPath) {
  let inners = await promises.readdir(srcPath, {withFileTypes: true});
  await promises.mkdir(destPath, {recursive: true});
  for (const inner of inners) {
    if (inner.isFile()) {
      await promises.copyFile(join(srcPath, inner.name), join(destPath, inner.name));
    } else if (inner.isDirectory()) {
      copyAssets(join(srcPath, inner.name), join(destPath, inner.name));
    }
  }
}

try {
  const projectPath = join(__dirname, '/project-dist');
  const templatePath = join(__dirname, 'template.html');
  const componentsPath = join(__dirname, '/components');
  const stylesPath = join(__dirname, '/styles');
  const assetsPath = join(__dirname, '/assets');

  createProjectDir(projectPath).catch((err) => console.error(err.message));
  createPageLayout(templatePath, componentsPath, projectPath).catch((err) => console.error(err.message));
  createStylesBundle(stylesPath, projectPath).catch((err) => console.error(err.message));
  copyAssets(assetsPath, join(projectPath, '/assets')).catch((err) => console.error(err.message));

} catch (err) {
  console.error(err.message);
}