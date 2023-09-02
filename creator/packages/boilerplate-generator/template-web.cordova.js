import template from './template';

const evalEnv = (function() {
  var regexp = /\${([^}]+)}/g;

  return function(str, o) {
        return str.replace(regexp, function(ignore, key){
              if(key === 'PLATFORM'){
                return 'cordova';
              }
              return (value = o[key]) == null ? '' : value;
        });
  }
})()

// Template function for rendering the boilerplate html for cordova
export const headTemplate = ({
  meteorRuntimeConfig,
  rootUrlPathPrefix,
  inlineScriptsAllowed,
  css,
  js,
  additionalStaticJs,
  htmlAttributes,
  bundledJsCssUrlRewriteHook,
  head,
  dynamicHead,
}) => {
  const replacedHead = evalEnv(head, process.env);
  var headSections = replacedHead.split(/<meteor-bundled-css[^<>]*>/, 2);
  var cssBundle = [
    // We are explicitly not using bundledJsCssUrlRewriteHook: in cordova we serve assets up directly from disk, so rewriting the URL does not make sense
    ...(css || []).map(file =>
      template('  <link rel="stylesheet" type="text/css" class="__meteor-css__" href="<%- href %>">')({
        href: file.url,
      })
  )].join('\n');

  return [
    '<html>',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="format-detection" content="telephone=no">',
    '  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, viewport-fit=cover">',
    '  <meta name="msapplication-tap-highlight" content="no">',
    '  <meta http-equiv="Content-Security-Policy" content="default-src * gap: data: blob: \'unsafe-inline\' \'unsafe-eval\' ws: wss:;">',

  (headSections.length === 1)
    ? [cssBundle, headSections[0]].join('\n')
    : [headSections[0], cssBundle, headSections[1]].join('\n'),

    '  <script type="text/javascript">',
    template('    __meteor_runtime_config__ = JSON.parse(decodeURIComponent(<%= conf %>));')({
      conf: meteorRuntimeConfig,
    }),
    '    if (/Android/i.test(navigator.userAgent)) {',
    // When Android app is emulated, it cannot connect to localhost,
    // instead it should connect to 10.0.2.2
    // (unless we\'re using an http proxy; then it works!)
    '      if (!__meteor_runtime_config__.httpProxyPort) {',
    '        __meteor_runtime_config__.ROOT_URL = (__meteor_runtime_config__.ROOT_URL || \'\').replace(/localhost/i, \'10.0.2.2\');',
    '        __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL = (__meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL || \'\').replace(/localhost/i, \'10.0.2.2\');',
    '      }',
    '    }',
    'if(!document.body){\n' +
    '    var tempBody = document.createElement("body");\n' +
    '    document.body = tempBody;\n' +
    '    document.addEventListener(\'DOMContentLoaded\', (event) => {\n' +
    '        tempBody.remove()\n' +
    '    });\n' +
    '}',
    '  </script>',
    '',
    '  <script type="text/javascript" src="/cordova.js"></script>',

    ...(js || []).map(file =>
      template('  <script type="text/javascript">loadJs("<%- src %>")</script>')({
        src: file.url,
      })
    ),

    ...(additionalStaticJs || []).map(({ contents, pathname }) => (
      inlineScriptsAllowed
        ? template('  <script><%= contents %></script>')({
          contents,
        })
        : template('  <script type="text/javascript">loadJs("<%- src %>")</script>')({
          src: Meteor.absoluteUrl(pathname)
        })
    )),
    '',
    '</head>',
    '',
    '<body>',
  ].join('\n');
};

export function closeTemplate() {
  return "</body>\n</html>";
}
