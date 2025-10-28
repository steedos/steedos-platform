/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-31 11:10:59
 * @Description: 
 */

; (function () {

    try {
        window['attrAccept'] = function (file, acceptedFiles) {
            if (file && acceptedFiles) {
              var acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
              var fileName = file.name || '';
              var mimeType = (file.type || '').toLowerCase();
              var baseMimeType = mimeType.replace(/\/.*$/, '');
              return acceptedFilesArray.some(function (type) {
                var validType = type.trim().toLowerCase();
          
                if (validType.charAt(0) === '.') {
                  return fileName.toLowerCase().endsWith(validType);
                } else if (validType.endsWith('/*')) {
                  // This is something like a image/* mime type
                  return baseMimeType === validType.replace(/\/.*$/, '');
                }
          
                return mimeType === validType;
              });
            }
          
            return true;
          }
    } catch (error) {
        console.error(error)
    };

})();