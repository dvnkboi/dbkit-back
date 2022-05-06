//use copyAsync from fs-extra to make a function to copy files from source to target folder
const fs = require('fs-extra');
const path = require('path');
var util = require('util');
const AdmZip = require("adm-zip");
const copy = require('recursive-copy');
const through = require('through2');

const options = {
	overwrite: true,
	expand: true,
	dot: true,
	junk: false,
};

const copyAsync = async (source, target) => {
  await fs.copy(source, target, {recursive: true});
};

const deleteAsync = async (source) => {
  try{
      await fs.remove(source)
  }
  catch(e){
    console.error(e);
  }
};

const copyBoilerPlate = async (userId) => {
  const dest = path.join(__dirname, `../download/tmp/${userId}`);
  const source = path.join(__dirname, '../stub/template/boilerPlate');
  await copy(source, dest, options);
}

//copy files and change their names from template to userId
const generateTemplateFiles = async (userId, name, schema) => {
  const source = path.join(__dirname, '../stub/template/src');
  const tmp = path.join(__dirname, `../download/tmp/${userId}/src`);
  const tmpCopyOptions = {
    ...options,
    rename: function(filePath) {
      return filePath.replace('_template_', name);
    },
    transform: function(src, dest, stats){
      return through(function(chunk, enc, done)  {
        let output = chunk.toString();
        if(path.dirname(src).includes('models')){
          output = output.replace('_template_Schema',util.inspect(schema)).replace(/'__/g, '').replace(/__'/g, '');
        }
        output = output.replace(/_template_/g, name).replace(/_Template_/g, name.charAt(0).toUpperCase() + name.slice(1));
        done(null, output);
      });
    }
  }
  await copy(source, tmp, tmpCopyOptions);
}

const flush = async (target, userId) => {
  await zipDirectory(path.join(__dirname, `../download/tmp/${userId}`), `src/download/${userId}.zip`);
}

const cleanUp = async (userId) => {
  const zip = path.join(__dirname, `../download/${userId}.zip`);
  const tmp = path.join(__dirname, `../download/tmp/${userId}`);
  try{
    await deleteAsync(zip);
  }
  catch(e){
    console.error('clean up zip',e);
  }
  try{
    await deleteAsync(tmp);
  }
  catch(e){
    console.error('clean up tmp ',e);
  }
}

const zipDirectory = async (sourceDir, outPath) => {
  const zip = new AdmZip();
  try {
    await zip.addLocalFolderPromise(sourceDir);
    await zip.writeZipPromise(outPath);
  }
  catch (e) {
    console.error('zipDirectory', e);
  }
}

const fileExists = async (file) => {
  return new Promise((resolve) => {
    fs.open(file, 'r', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false);
          return;
        }
        resolve(false);
      }
      else resolve(true);
    });
  });
}


module.exports = {
  copyAsync,
  deleteAsync,
  copyBoilerPlate,
  generateTemplateFiles,
  flush,
  fileExists,
  cleanUp,
};