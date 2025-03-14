
const supportedFormats = require('./onlyoffice-docs-formats.json'); // eslint-disable-line

const fileUtility = {};

fileUtility.getFormats = function getFormats() {
  return supportedFormats;
};

// get file name from the given url
fileUtility.getFileNameFromUrl = function getFileNameFromUrl(url, withoutExtension) {
  if (!url) return '';

  let parts = url.split('\\');
  parts = parts.pop();
  const path = parts.split('?')[0];

  return fileUtility.getFileName(path, withoutExtension);
};

// get file name
fileUtility.getFileName = function getFileName(path, withoutExtension) {
  if (!path) return '';

  const parts = path.split('/');
  const fileName = parts.pop(); // get the file name from the last part of the path

  // get file name without extension
  if (withoutExtension) {
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

  return fileName;
};

// get file extension from the given path
fileUtility.getFileExtension = function getFileExtension(path, withoutDot, isUrl) {
  if (!path) return null;

  // get file name from the given path
  const fileName = isUrl ? fileUtility.getFileNameFromUrl(path) : fileUtility.getFileName(path);

  const parts = fileName.toLowerCase().split('.');

  return withoutDot ? parts.pop() : `.${parts.pop()}`; // get the extension from the file name with or without dot
};

// get file type from the given path
fileUtility.getFileType = function getFileType(path) {
  const ext = fileUtility.getFileExtension(path, true); // get the file extension from the given path

  for (let i = 0; i < supportedFormats.length; i++) {
    if (supportedFormats[i].name === ext && supportedFormats[i].type !== '') return supportedFormats[i].type;
  }

  return null; // the default file type is null
};

fileUtility.fileType = {
  word: 'word',
  cell: 'cell',
  slide: 'slide',
  pdf: 'pdf',
};

fileUtility.getFormatActions = function getExtensionActions(ext) {
  return supportedFormats.filter((format) => format.name === ext)[0]?.actions || [];
};

fileUtility.getSuppotredExtensions = function getSuppotredExtensions() {
  return supportedFormats.reduce((extensions, format) => [...extensions, format.name], []);
};

fileUtility.getViewExtensions = function getViewExtensions() {
  return supportedFormats.filter(
    (format) => format.actions.includes('view'),
  ).reduce((extensions, format) => [...extensions, format.name], []);
};

fileUtility.getEditExtensions = function getEditExtensions() {
  return supportedFormats.filter(
    (format) => format.actions.includes('edit') || format.actions.includes('lossy-edit'),
  ).reduce((extensions, format) => [...extensions, format.name], []);
};

fileUtility.getFillExtensions = function getFillExtensions() {
  return supportedFormats.filter(
    (format) => format.actions.includes('fill'),
  ).reduce((extensions, format) => [...extensions, format.name], []);
};

fileUtility.getConvertExtensions = function getConvertExtensions() {
  return supportedFormats.filter(
    (format) => format.actions.includes('auto-convert'),
  ).reduce((extensions, format) => [...extensions, format.name], []);
};

// get url parameters
// eslint-disable-next-line no-unused-vars
const getUrlParams = function getUrlParams(url) {
  try {
    const query = url.split('?').pop(); // take all the parameters which are placed after ? sign in the file url
    const params = query.split('&'); // parameters are separated by & sign
    const map = {}; // write parameters and their values to the map dictionary
    for (let i = 0; i < params.length; i++) {
      // eslint-disable-next-line no-undef
      const parts = param.split('=');
      [, map[parts[0]]] = parts;
    }
    return map;
  } catch (ex) {
    return null;
  }
};

// save all the functions to the fileUtility module to export it later in other files
module.exports = fileUtility;
