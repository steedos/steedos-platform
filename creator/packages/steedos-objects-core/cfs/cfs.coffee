@cfs = {}

Meteor.startup ->
  FS.HTTP.setBaseUrl("/api")


# 通过文件扩展名获取文件contentType
# http://reference.sitepoint.com/html/mime-types
# 参照s3上传附件后的contentType
cfs.getContentType = (filename) ->
    _exp = filename.split('.').pop().toLowerCase()
    if ('.' + _exp == '.au') 
      return 'audio/basic'
    else if ('.' + _exp == '.avi') 
      return 'video/x-msvideo'
    else if ('.' + _exp == '.bmp') 
      return 'image/bmp'
    else if ('.' + _exp == '.bz2') 
      return 'application/x-bzip2'
    else if ('.' + _exp == '.css') 
      return 'text/css'
    else if ('.' + _exp == '.dtd') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.doc') 
      return 'application/msword'
    else if ('.' + _exp == '.docx') 
      return 'application/msword'
    else if ('.' + _exp == '.dotx') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.es') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.exe') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.gif') 
      return 'image/gif'
    else if ('.' + _exp == '.gz') 
      return 'application/x-gzip'
    else if ('.' + _exp == '.hqx') 
      return 'application/mac-binhex40'
    else if ('.' + _exp == '.html') 
      return 'text/html'
    else if ('.' + _exp == '.jar') 
      return 'application/x-java-archive'
    else if (('.' + _exp == '.jpg') || ('.' + _exp == '.jpeg')) 
      return 'image/jpeg'
    else if ('.' + _exp == '.js') 
      return 'application/x-javascript'
    else if ('.' + _exp == '.jsp') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.midi') 
      return 'audio/midi'
    else if ('.' + _exp == '.mp3') 
      return 'audio/mpeg'
    else if ('.' + _exp == '.mpeg') 
      return 'video/mpeg'
    else if ('.' + _exp == '.ogg') 
      return 'application/ogg'
    else if ('.' + _exp == '.pdf') 
      return 'application/pdf'
    else if ('.' + _exp == '.pl') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.png') 
      return 'image/png'
    else if ('.' + _exp == '.potx') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.ppsx') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.ppt') 
      return 'application/vnd.ms-powerpoint'
    else if ('.' + _exp == '.pptx') 
      return 'application/vnd.ms-powerpoint'
    else if ('.' + _exp == '.ps') 
      return 'application/postscript'
    else if ('.' + _exp == '.qt') 
      return 'video/quicktime'
    else if ('.' + _exp == '.ra') 
      return 'audio/x-pn-realaudio'
    else if ('.' + _exp == '.ram') 
      return 'audio/x-pn-realaudio'
    else if ('.' + _exp == '.rdf') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.rtf') 
      return 'text/rtf'
    else if ('.' + _exp == '.sgml') 
      return 'text/sgml'
    else if ('.' + _exp == '.sit') 
      return 'application/x-stuffit'
    else if ('.' + _exp == '.sldx') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.svg') 
      return 'image/svg+xml'
    else if ('.' + _exp == '.swf') 
      return 'application/x-shockwave-flash'
    else if ('.' + _exp == '.tar.gz') 
      return 'application/x-gzip'
    else if ('.' + _exp == '.tgz') 
      return 'application/x-compressed'
    else if ('.' + _exp == '.tiff') 
      return 'image/tiff'
    else if ('.' + _exp == '.tsv') 
      return 'text/tab-separated-values'
    else if ('.' + _exp == '.txt') 
      return 'text/plain'
    else if ('.' + _exp == '.wav') 
      return 'audio/x-wav'
    else if ('.' + _exp == '.xlam') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.xls') 
      return 'application/vnd.ms-excel'
    else if ('.' + _exp == '.xlsb') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.xlsx') 
      return 'application/vnd.ms-excel'
    else if ('.' + _exp == '.xltx') 
      return 'application/octet-stream'
    else if ('.' + _exp == '.xml') 
      return 'text/xml'
    else if ('.' + _exp == '.zip') 
      return 'application/zip'
    else 
      return 'application/octet-stream'
    


