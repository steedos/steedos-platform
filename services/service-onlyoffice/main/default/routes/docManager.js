/**
 *
 * (c) Copyright Ascensio System SIA 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
const storageConfigFolder = "";
const path = require('path');
const fileSystem = require('fs');
const fileUtility = require('./fileUtility');

const DocManager = function DocManager(req, res) {
  this.req = req;
  this.res = res;
};

// get the language from the request
DocManager.prototype.getLang = function getLang() {
  if (/^[a-z]{2}(-[a-zA-z]{4})?(-[A-Z]{2})?$/.test(this.req.query.lang)) {
    return this.req.query.lang;
  } // the default language value is English
  return 'zh-CN';
};

// get server url
DocManager.prototype.getServerUrl = function getServerUrl(forDocumentServer) {
  return process.env.ROOT_URL;
};



// get callback url
DocManager.prototype.getCallback = function getCallback(fileName, cmsId, userId) {
  const server = this.getServerUrl(true);
  // get callback handler
  const handler = '/api/v6/onlyoffice/cms_files/' + cmsId + `/track?filename=${encodeURIComponent(fileName)}&userId=${userId}`;

  return server + handler;
};


// get current user host address
DocManager.prototype.curUserHostAddress = function curUserHostAddress(userAddress) {
  let address = userAddress;
  if (!address) { // if user address isn't passed to the function
    // take it from the header or use the remote address
    address = this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress;
  }

  return address.replace(/[^0-9a-zA-Z.=]/g, '_');
};


DocManager.prototype.getInstanceId = function getInstanceId() {
  return this.getServerUrl();
};

// save all the functions to the DocManager module to export it later in other files
module.exports = DocManager;
