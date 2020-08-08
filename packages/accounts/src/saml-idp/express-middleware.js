
/**
 * Module dependencies.
 */

const chalk               = require('chalk'),
      express             = require('express'),
      os                  = require('os'),
      fs                  = require('fs'),
      http                = require('http'),
      https               = require('https'),
      path                = require('path'),
      extend              = require('extend'),
      hbs                 = require('hbs'),
      logger              = require('morgan'),
      bodyParser          = require('body-parser'),
      session             = require('express-session'),
      yargs               = require('yargs/yargs'),
      xmlFormat           = require('xml-formatter'),
      samlp               = require('samlp'),
      Parser              = require('xmldom').DOMParser,
      SessionParticipants = require('samlp/lib/sessionParticipants'),
      SimpleProfileMapper = require('./simpleProfileMapper.js');

/**
 * Globals
 */

const IDP_PATHS = {
  SSO: '/idp/sso',
  SLO: '/idp/slo',
  METADATA: '/metadata',
  SIGN_IN: '/signin',
  SIGN_OUT: '/signout',
  SETTINGS: '/settings'
}
const CERT_OPTIONS = [
  'cert',
  'key',
  'encryptionCert',
  'encryptionPublicKey',
  'httpsPrivateKey',
  'httpsCert',
];
const WILDCARD_ADDRESSES = ['0.0.0.0', '::'];
const UNDEFINED_VALUE = 'None';
const CRYPT_TYPES = {
  certificate: /-----BEGIN CERTIFICATE-----[^-]*-----END CERTIFICATE-----/,
  'RSA private key': /-----BEGIN RSA PRIVATE KEY-----\n[^-]*\n-----END RSA PRIVATE KEY-----/,
  'public key': /-----BEGIN PUBLIC KEY-----\n[^-]*\n-----END PUBLIC KEY-----/,
};
const KEY_CERT_HELP_TEXT = dedent(chalk`
  To generate a key/cert pair for the IdP, run the following command:

  {gray openssl req -x509 -new -newkey rsa:2048 -nodes \
    -subj '/C=US/ST=California/L=San Francisco/O=JankyCo/CN=Test Identity Provider' \
    -keyout idp-private-key.pem \
    -out idp-public-cert.pem -days 7300}`
);

function matchesCertType(value, type) {
  return CRYPT_TYPES[type] && CRYPT_TYPES[type].test(value);
}

function resolveFilePath(filePath) {

  if (filePath.startsWith('saml-idp/')) {
    // Allows file path options to files included in this package, like config.js
    const resolvedPath = require.resolve(filePath.replace(/^saml\-idp\//, `${__dirname}/`));
    return fs.existsSync(resolvedPath) && resolvedPath;
  }
  var possiblePath;
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  if (filePath.startsWith('~/')) {
    possiblePath = path.resolve(process.env.HOME, filePath.slice(2));
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    } else {
      // for ~/ paths, don't try to resolve further
      return filePath;
    }
  }
  return ['.', __dirname]
    .map(base => path.resolve(base, filePath))
    .find(possiblePath => fs.existsSync(possiblePath));
}

function makeCertFileCoercer(type, description, helpText) {
  return function certFileCoercer(value) {
    if (matchesCertType(value, type)) {
      return value;
    }

    const filePath = resolveFilePath(value);
    if (filePath) {
      return fs.readFileSync(filePath)
    }
    throw new Error(
      chalk`{red Invalid / missing {bold ${description}}} - {yellow not a valid crypt key/cert or file path}${helpText ? '\n' + helpText : ''}`
    )
  };
}

function getHashCode(str) {
  var hash = 0;
  if (str.length == 0) return hash;
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function dedent(str) {
  // Reduce the indentation of all lines by the indentation of the first line
  const match = str.match(/^\n?( +)/);
  if (!match) {
    return str;
  }
  const indentRe = new RegExp(`\n${match[1]}`, 'g');
  return str.replace(indentRe, '\n').replace(/^\n/, '');
}

function formatOptionValue(key, value) {
  if (typeof value === 'string') {
    return value;
  }
  if (CERT_OPTIONS.includes(key)) {
    return chalk`${
      value.toString()
        .replace(/-----.+?-----|\n/g, '')
        .substring(0, 80)
    }{white …}`;
  }
  if (!value && value !== false) {
    return UNDEFINED_VALUE;
  }
  if (typeof value === 'function') {
    const lines = `${value}`.split('\n');
    return lines[0].slice(0, -2);
  }
  return `${JSON.stringify(value)}`;
}

function prettyPrintXml(xml, indent) {
  // This works well, because we format the xml before applying the replacements
  const prettyXml = xmlFormat(xml, {indentation: '  '})
    // Matches `<{prefix}:{name} .*?>`
    .replace(/<(\/)?((?:[\w]+)(?::))?([\w]+)(.*?)>/g, chalk`<{green $1$2{bold $3}}$4>`)
    // Matches ` {attribute}="{value}"
    .replace(/ ([\w:]+)="(.+?)"/g, chalk` {white $1}={cyan "$2"}`);
  if (indent) {
    return prettyXml.replace(/(^|\n)/g, `$1${' '.repeat(indent)}`);
  }
  return prettyXml;
}

/**
 * Arguments
 */
function processArgs(args, options) {
  var baseArgv;

  if (options) {
    baseArgv = yargs(args).config(options);
  } else {
    baseArgv = yargs(args);
  }
  return baseArgv
    .usage('\nSimple IdP for SAML 2.0 WebSSO & SLO Profile\n\n' +
        'Launches an IdP web server that mints SAML assertions or logout responses for a Service Provider (SP)\n\n' +
        'Usage:\n\t$0 --acsUrl {url} --audience {uri}')
    .alias({h: 'help'})
    .options({
      host: {
        description: 'IdP Web Server Listener Host',
        required: false,
        default: 'localhost'
      },
      port: {
        description: 'IdP Web Server Listener Port',
        required: true,
        alias: 'p',
        default: 7000
      },
      cert: {
        description: 'IdP Signature PublicKey Certificate',
        required: true,
        default: './idp-public-cert.pem',
        coerce: makeCertFileCoercer('certificate', 'IdP Signature PublicKey Certificate', KEY_CERT_HELP_TEXT)
      },
      key: {
        description: 'IdP Signature PrivateKey Certificate',
        required: true,
        default: './idp-private-key.pem',
        coerce: makeCertFileCoercer('RSA private key', 'IdP Signature PrivateKey Certificate', KEY_CERT_HELP_TEXT)
      },
      issuer: {
        description: 'IdP Issuer URI',
        required: true,
        alias: 'iss',
        default: 'urn:example:idp'
      },
      acsUrl: {
        description: 'SP Assertion Consumer URL',
        required: true,
        alias: 'acs'
      },
      sloUrl: {
        description: 'SP Single Logout URL',
        required: false,
        alias: 'slo'
      },
      audience: {
        description: 'SP Audience URI',
        required: true,
        alias: 'aud'
      },
      serviceProviderId: {
        description: 'SP Issuer/Entity URI',
        required: false,
        alias: 'spId',
        string: true
      },
      relayState: {
        description: 'Default SAML RelayState for SAMLResponse',
        required: false,
        alias: 'rs'
      },
      disableRequestAcsUrl: {
        description: 'Disables ability for SP AuthnRequest to specify Assertion Consumer URL',
        required: false,
        boolean: true,
        alias: 'static',
        default: false
      },
      encryptAssertion: {
        description: 'Encrypts assertion with SP Public Key',
        required: false,
        boolean: true,
        alias: 'enc',
        default: false
      },
      encryptionCert: {
        description: 'SP Certificate (pem) for Assertion Encryption',
        required: false,
        string: true,
        alias: 'encCert',
        coerce: makeCertFileCoercer('certificate', 'Encryption cert')
      },
      encryptionPublicKey: {
        description: 'SP RSA Public Key (pem) for Assertion Encryption ' +
        '(e.g. openssl x509 -pubkey -noout -in sp-cert.pem)',
        required: false,
        string: true,
        alias: 'encKey',
        coerce: makeCertFileCoercer('public key', 'Encryption public key')
      },
      httpsPrivateKey: {
        description: 'Web Server TLS/SSL Private Key (pem)',
        required: false,
        string: true,
        coerce: makeCertFileCoercer('RSA private key')
      },
      httpsCert: {
        description: 'Web Server TLS/SSL Certificate (pem)',
        required: false,
        string: true,
        coerce: makeCertFileCoercer('certificate')
      },
      https: {
        description: 'Enables HTTPS Listener (requires httpsPrivateKey and httpsCert)',
        required: true,
        boolean: true,
        default: false
      },
      signResponse: {
        description: 'Enables signing of responses',
        required: false,
        boolean: true,
        default: true,
        alias: 'signResponse'
      },
      configFile: {
        description: 'Path to a SAML attribute config file',
        required: true,
        default: 'saml-idp/config.js',
        alias: 'conf'
      },
      rollSession: {
        description: 'Create a new session for every authn request instead of reusing an existing session',
        required: false,
        boolean: true,
        default: false
      },
      authnContextClassRef: {
        description: 'Authentication Context Class Reference',
        required: false,
        string: true,
        default: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
        alias: 'acr'
      },
      authnContextDecl: {
        description: 'Authentication Context Declaration (XML FilePath)',
        required: false,
        string: true,
        alias: 'acd',
        coerce: function (value) {
          const filePath = resolveFilePath(value);
          if (filePath) {
            return fs.readFileSync(filePath, 'utf8')
          }
        }
      }
    })
    .example('$0 --acsUrl http://acme.okta.com/auth/saml20/exampleidp --audience https://www.okta.com/saml2/service-provider/spf5aFRRXFGIMAYXQPNV', '')
    .check(function(argv, aliases) {
      if (argv.encryptAssertion) {
        if (argv.encryptionPublicKey === undefined) {
          return 'encryptionPublicKey argument is also required for assertion encryption';
        }
        if (argv.encryptionCert === undefined) {
          return 'encryptionCert argument is also required for assertion encryption';
        }
      }
      return true;
    })
    .check(function(argv, aliases) {
      if (argv.config) {
        return true;
      }
      const configFilePath = resolveFilePath(argv.configFile);

      if (!configFilePath) {
        return 'SAML attribute config file path "' + argv.configFile + '" is not a valid path.\n';
      }
      try {
        argv.config = require(configFilePath);
      } catch (error) {
        return 'Encountered an exception while loading SAML attribute config file "' + configFilePath + '".\n' + error;
      }
      return true;
    })
    .wrap(baseArgv.terminalWidth());
}

const app = express.Router();

function _runServer(argv) {

  const blocks = {};

  console.log(dedent(chalk`
    Listener Port:
      {cyan ${argv.host}:${argv.port}}
    HTTPS Enabled:
      {cyan ${argv.https}}

    {bold [{yellow Identity Provider}]}

    Issuer URI:
      {cyan ${argv.issuer}}
    Sign Response Message:
      {cyan ${argv.signResponse}}
    Encrypt Assertion:
      {cyan ${argv.encryptAssertion}}
    Authentication Context Class Reference:
      {cyan ${argv.authnContextClassRef || UNDEFINED_VALUE}}
    Authentication Context Declaration:
      {cyan ${argv.authnContextDecl || UNDEFINED_VALUE}}
    Default RelayState:
      {cyan ${argv.relayState || UNDEFINED_VALUE}}

    {bold [{yellow Service Provider}]}

    serviceProviderId URI:
      {cyan ${argv.serviceProviderId || UNDEFINED_VALUE}}
    Audience URI:
      {cyan ${argv.audience || UNDEFINED_VALUE}}
    ACS URL:
      {cyan ${argv.acsUrl || UNDEFINED_VALUE}}
    SLO URL:
      {cyan ${argv.sloUrl || UNDEFINED_VALUE}}
    Trust ACS URL in Request:
      {cyan ${!argv.disableRequestAcsUrl}}
  `));


  /**
   * IdP Configuration
   */

  const idpOptions = {
    issuer:                 argv.issuer,
    serviceProviderId:      argv.serviceProviderId || argv.audience,
    cert:                   argv.cert,
    key:                    argv.key,
    audience:               argv.audience,
    recipient:              argv.acsUrl,
    destination:            argv.acsUrl,
    acsUrl:                 argv.acsUrl,
    sloUrl:                 argv.sloUrl,
    RelayState:             argv.relayState,
    allowRequestAcsUrl:     !argv.disableRequestAcsUrl,
    digestAlgorithm:        'sha256',
    signatureAlgorithm:     'rsa-sha256',
    signResponse:           argv.signResponse,
    encryptAssertion:       argv.encryptAssertion,
    encryptionCert:         argv.encryptionCert,
    encryptionPublicKey:    argv.encryptionPublicKey,
    encryptionAlgorithm:    'http://www.w3.org/2001/04/xmlenc#aes256-cbc',
    keyEncryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p',
    lifetimeInSeconds:      3600,
    authnContextClassRef:   argv.authnContextClassRef,
    authnContextDecl:       argv.authnContextDecl,
    includeAttributeNameFormat: true,
    profileMapper:          SimpleProfileMapper.fromMetadata(argv.config.metadata),
    postEndpointPath:       IDP_PATHS.SSO,
    redirectEndpointPath:   IDP_PATHS.SSO,
    logoutEndpointPaths:    argv.sloUrl ?
                            {
                              redirect: IDP_PATHS.SLO,
                              post: IDP_PATHS.SLO
                            } : {},
    getUserFromRequest:     function(req) { return req.user; },
    getPostURL:             function (audience, authnRequestDom, req, callback) {
                              return callback(null, (req.authnRequest && req.authnRequest.acsUrl) ?
                                req.authnRequest.acsUrl :
                                argv.acsUrl);
                            },
    transformAssertion:     function(assertionDom) {
                              if (argv.authnContextDecl) {
                                var declDoc;
                                try {
                                  declDoc = new Parser().parseFromString(argv.authnContextDecl);
                                } catch(err){
                                  console.log('Unable to parse Authentication Context Declaration XML', err);
                                }
                                if (declDoc) {
                                  const authnContextDeclEl = assertionDom.createElementNS('urn:oasis:names:tc:SAML:2.0:assertion', 'saml:AuthnContextDecl');
                                  authnContextDeclEl.appendChild(declDoc.documentElement);
                                  const authnContextEl = assertionDom.getElementsByTagName('saml:AuthnContext')[0];
                                  authnContextEl.appendChild(authnContextDeclEl);
                                }
                              }
                            },
    responseHandler:        function(response, opts, req, res, next) {
                              console.log(dedent(chalk`
                                Sending SAML Response to {cyan ${opts.postUrl}} =>
                                  {bold RelayState} =>
                                    {cyan ${opts.RelayState || UNDEFINED_VALUE}}
                                  {bold SAMLResponse} =>`
                              ));

                              console.log(prettyPrintXml(response.toString(), 4));

                              res.render('samlresponse', {
                                AcsUrl: opts.postUrl,
                                SAMLResponse: response.toString('base64'),
                                RelayState: opts.RelayState
                              });
                            }
  }

  /**
   * App Environment
   */

  // app.set('host', process.env.HOST || argv.host);
  // app.set('port', process.env.PORT || argv.port);
  // app.set('views', path.join(__dirname, 'views'));

  /**
   * View Engine
   */

  // app.set('view engine', 'hbs');
  // app.set('view options', { layout: 'layout' })
  // app.engine('handlebars', hbs.__express);

  // Register Helpers
  hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
      block = blocks[name] = [];
    }

    block.push(context.fn(this));
  });

  hbs.registerHelper('block', function(name) {
    const val = (blocks[name] || []).join('\n');
    // clear the block
    blocks[name] = [];
    return val;
  });


  hbs.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"');
  });

  hbs.registerHelper('getProperty', function(attribute, context) {
    return context[attribute];
  });

  hbs.registerHelper('serialize', function(context) {
    return new Buffer(JSON.stringify(context)).toString('base64');
  });

  /**
   * Middleware
   */

  app.use(logger(':date> :method :url - {:referrer} => :status (:response-time ms)', {
    skip: function (req, res)
      {
        return req.path.startsWith('/bower_components') || req.path.startsWith('/css')
      }
  }));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({
    secret: 'The universe works on a math equation that never even ever really ends in the end',
    resave: false,
    saveUninitialized: true,
    name: 'idp_sid',
    cookie: { maxAge: 60 * 60 * 1000 }
  }));

  /**
   * View Handlers
   */

  const showUser = function (req, res, next) {
    res.render('user', {
      user: req.user,
      participant: req.participant,
      metadata: req.metadata,
      authnRequest: req.authnRequest,
      idp: req.idp.options,
      paths: IDP_PATHS
    });
  }

  /**
   * Shared Handlers
   */

  const parseSamlRequest = function(req, res, next) {
    samlp.parseRequest(req, function(err, data) {
      if (err) {
        return res.render('error', {
          message: 'SAML AuthnRequest Parse Error: ' + err.message,
          error: err
        });
      };
      if (data) {
        req.authnRequest = {
          relayState: req.query.RelayState || req.body.RelayState,
          id: data.id,
          issuer: data.issuer,
          destination: data.destination,
          acsUrl: data.assertionConsumerServiceURL,
          forceAuthn: data.forceAuthn === 'true'
        };
        console.log('Received AuthnRequest => \n', req.authnRequest);
      }
      if (req.user != undefined){
        return showUser(req, res, next);
      } else {
        console.log('Redirect to login => \n');
        res.redirect("/accounts/a/#/login?redirect_uri="+ encodeURIComponent(req.originalUrl));
        return res.end();
      }
    })
  };

  const getSessionIndex = function(req) {
    if (req && req.session) {
      return Math.abs(getHashCode(req.session.id)).toString();
    }
  }

  const getParticipant = function(req) {
    return {
      serviceProviderId: req.idp.options.serviceProviderId,
      sessionIndex: getSessionIndex(req),
      nameId: req.user.username,
      nameIdFormat: req.user.nameIdFormat,
      serviceProviderLogoutURL: req.idp.options.sloUrl
    }
  }

  const parseLogoutRequest = function(req, res, next) {
    if (!req.idp.options.sloUrl) {
      return res.render('error', {
        message: 'SAML Single Logout Service URL not defined for Service Provider'
      });
    };

    console.log('Processing SAML SLO request for participant => \n', req.participant);

    return samlp.logout({
      issuer:                 req.idp.options.issuer,
      cert:                   req.idp.options.cert,
      key:                    req.idp.options.key,
      digestAlgorithm:        req.idp.options.digestAlgorithm,
      signatureAlgorithm:     req.idp.options.signatureAlgorithm,
      sessionParticipants:    new SessionParticipants(
      [
        req.participant
      ]),
      clearIdPSession: function(callback) {
        console.log('Destroying session ' + req.session.id + ' for participant', req.participant);
        req.session.destroy();
        callback();
      }
    })(req, res, next);
  }

  /**
   * Routes
   */

  app.use(function(req, res, next){
    if (argv.rollSession) {
      req.session.regenerate(function(err) {
        return next();
      });
    } else {
      next()
    }
  });

  app.use(function(req, res, next){
    //req.user = argv.config.user;
    req.metadata = argv.config.metadata;
    req.idp = { options: idpOptions };
    if (req.user)
      req.participant = getParticipant(req);
    next();
  });

  app.get(['/', '/idp', IDP_PATHS.SSO], parseSamlRequest);
  app.post(['/', '/idp', IDP_PATHS.SSO], parseSamlRequest);

  app.get(IDP_PATHS.SLO, parseLogoutRequest);
  app.post(IDP_PATHS.SLO, parseLogoutRequest);

  app.post(IDP_PATHS.SIGN_IN, function(req, res) {
    const authOptions = extend({}, req.idp.options);
    Object.keys(req.body).forEach(function(key) {
      var buffer;
      if (key === '_authnRequest') {
        buffer = new Buffer(req.body[key], 'base64');
        req.authnRequest = JSON.parse(buffer.toString('utf8'));

        // Apply AuthnRequest Params
        authOptions.inResponseTo = req.authnRequest.id;
        if (req.idp.options.allowRequestAcsUrl && req.authnRequest.acsUrl) {
          authOptions.acsUrl = req.authnRequest.acsUrl;
          authOptions.recipient = req.authnRequest.acsUrl;
          authOptions.destination = req.authnRequest.acsUrl;
          authOptions.forceAuthn = req.authnRequest.forceAuthn;
        }
        if (req.authnRequest.relayState) {
          authOptions.RelayState = req.authnRequest.relayState;
        }
      } else {
        req.user[key] = req.body[key];
      }
    });

    if (!authOptions.encryptAssertion) {
      delete authOptions.encryptionCert;
      delete authOptions.encryptionPublicKey;
    }

    // Set Session Index
    authOptions.sessionIndex = getSessionIndex(req);

    // Keep calm and Single Sign On
    console.log(dedent(chalk`
      Generating SAML Response using =>
        {bold User} => ${Object.entries(req.user).map(([key, value]) => chalk`
          ${key}: {cyan ${value}}`
        ).join('')}
        {bold SAMLP Options} => ${Object.entries(authOptions).map(([key, value]) => chalk`
          ${key}: {cyan ${formatOptionValue(key, value)}}`
        ).join('')}
    `));
    samlp.auth(authOptions)(req, res);
  })

  app.get(IDP_PATHS.METADATA, function(req, res, next) {
    samlp.metadata(req.idp.options)(req, res);
  });

  app.post(IDP_PATHS.METADATA, function(req, res, next) {
    if (req.body && req.body.attributeName && req.body.name) {
      var attributeExists = false;
      const attribute = {
        id: req.body.attributeName,
        optional: true,
        name: req.body.name,
        description: req.body.description || '',
        multiValue: req.body.valueType === 'multi'
      };

      req.metadata.forEach(function(entry) {
        if (entry.id === req.body.attributeName) {
          entry = attribute;
          attributeExists = true;
        }
      });

      if (!attributeExists) {
        req.metadata.push(attribute);
      }
      console.log("Updated SAML Attribute Metadata => \n", req.metadata)
      res.status(200).end();
    }
  });

  app.get(IDP_PATHS.SIGN_OUT, function(req, res, next) {
    if (req.idp.options.sloUrl) {
      console.log('Initiating SAML SLO request for user: ' + req.user.username +
      ' with sessionIndex: ' + getSessionIndex(req));
      res.redirect(IDP_PATHS.SLO);
    } else {
      console.log('SAML SLO is not enabled for SP, destroying IDP session');
      req.session.destroy(function(err) {
        if (err) {
          throw err;
        }
        res.redirect('back');
      })
    }
  });

  app.get([IDP_PATHS.SETTINGS], function(req, res, next) {
    res.render('settings', {
      idp: req.idp.options
    });
  });

  app.post([IDP_PATHS.SETTINGS], function(req, res, next) {
    Object.keys(req.body).forEach(function(key) {
      switch(req.body[key].toLowerCase()){
        case "true": case "yes": case "1":
          req.idp.options[key] = true;
          break;
        case "false": case "no": case "0":
          req.idp.options[key] = false;
          break;
        default:
          req.idp.options[key] = req.body[key];
          break;
      }

      if (req.body[key].match(/^\d+$/)) {
        req.idp.options[key] = parseInt(req.body[key], '10');
      }
    });

    console.log('Updated IdP Configuration => \n', req.idp.options);
    res.redirect('/');
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Route Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  app.use(function(err, req, res, next) {
    if (err) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
    }
  });

}

function runServer(options) {
  const args = processArgs([], options);
  return _runServer(args.argv);
}

function main () {
  const args = processArgs(process.argv.slice(2));
  _runServer(args.argv);
}


module.exports = {
  samlIdp: {
    run: runServer,
    expressMiddleware: app
  }
};