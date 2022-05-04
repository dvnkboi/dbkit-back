//use copyAsync from fs-extra to make a function to copy files from source to target folder
const fs = require('fs-extra');
const path = require('path');
const replace = require("replace-in-file");
var util = require('util');
const AdmZip = require("adm-zip");
const reflect = require('@alumna/reflect');

const copyAsync = async (source, target) => {
  await fs.copy(source, target);
};

const deleteAsync = async (source) => {
  await fs.remove(source);
};

//replace file names in a source directory with parameter
const replaceFileNames = async (sourceDir, from, to) => {
  const files = await fs.readdir(sourceDir);
  files.forEach(async file => {
    const stat = await fs.stat(path.join(sourceDir, file));
    if (stat.isDirectory()) {
      await replaceFileNames(path.join(sourceDir, file), from, to);
    } else {
      const source = path.join(sourceDir, file);
      const target = path.join(sourceDir, file.replace(from, to));
      await renameAsync(source, target);
    }
  });
}


const renameAsync = async (source, target) => {
  await fs.rename(source, target);
};

const replaceAsync = async (sources, from, to) => {
  try {
    await replace({
      files: sources,
      from: from,
      to: to
    })
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}

const copyBoilerPlate = async (target) => {
  await deleteAsync(path.join(__dirname, `${target}`));
  const source = path.join(__dirname, '../stub/template/boilerPlate');
  await reflect({
    src: source,
    dest: path.join(__dirname, target)
  });
}

//copy files and change their names from template to userId
const copyTemplateFiles = async (userId,target, name, schema) => {
  const source = path.join(__dirname, '../stub/template/src');
  const tmp = path.join(__dirname, `../stub/tmp/${userId}` );
  await reflect({
    src: source,
    dest: tmp,
    overwrite: true,
    delete: false
  });
  await replaceAsync([`${tmp}/models/*.js`], '_template_Schema', util.inspect(schema));
  await replaceAsync([`${tmp}/models/*.js`], /'__/g, '');
  await replaceAsync([`${tmp}/models/*.js`], /__'/g, '');
  await replaceAsync([`${tmp}/controllers/*.js`, tmp + '/models/*.js',`${tmp}/routes/*.js`], /_template_/g, name);
  await replaceAsync([`${tmp}/controllers/*.js`, tmp + '/models/*.js',`${tmp}/routes/*.js`], /_Template_/g, name.charAt(0).toUpperCase() + name.slice(1));
  await replaceFileNames(tmp, '_template_', name);
}

const flush = async (target, userId) => {
  const tmp = path.join(__dirname, `../stub/tmp/${userId}` );
  await reflect({
    src: tmp,
    dest: path.join(__dirname,`${target}/${userId}/src`),
    overwrite: true,
    delete: false
  });
  await zipDirectory(path.join(__dirname,`${target}/${userId}`), `src/download/${userId}.zip`);
  await deleteAsync(path.join(__dirname,`${target}/${userId}`));
  await deleteAsync(tmp);
}

const zipDirectory = async (sourceDir, outPath) => {
  const zip = new AdmZip();
  try{
    await zip.addLocalFolderPromise(sourceDir);
    await zip.writeZipPromise(outPath);
  }
  catch(e){
    console.error('zipDirectory', e);
  }
}


module.exports = {
  copyAsync,
  deleteAsync,
  replaceAsync,
  renameAsync,
  copyBoilerPlate,
  copyTemplateFiles,
  flush
};