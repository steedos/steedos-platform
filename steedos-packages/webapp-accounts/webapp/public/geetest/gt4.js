"v4.1.5 Geetest Inc.";

(function (window) {
    "use strict";
    if (typeof window === 'undefined') {
        throw new Error('Geetest requires browser environment');
    }

var document = window.document;
var Math = window.Math;
var head = document.getElementsByTagName("head")[0];
var TIMEOUT = 10000;

function _Object(obj) {
    this._obj = obj;
}

_Object.prototype = {
    _each: function (process) {
        var _obj = this._obj;
        for (var k in _obj) {
            if (_obj.hasOwnProperty(k)) {
                process(k, _obj[k]);
            }
        }
        return this;
    },
    _extend: function (obj){
        var self = this;
        new _Object(obj)._each(function (key, value){
            self._obj[key] = value;
        })
    }
};

var uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

function Config(config) {
    var self = this;
    new _Object(config)._each(function (key, value) {
        self[key] = value;
    });
}

Config.prototype = {
    apiServers: ['gcaptcha4.geetest.com','gcaptcha4.geevisit.com','gcaptcha4.gsensebot.com'],
    staticServers: ["static.geetest.com",'static.geevisit.com', "dn-staticdown.qbox.me"],
    protocol: 'http://',
    typePath: '/load',
    fallback_config: {
        bypass: {
            staticServers: ["static.geetest.com",'static.geevisit.com',"dn-staticdown.qbox.me"],
            type: 'bypass',
            bypass: '/v4/bypass.js'
        }
    },
    _get_fallback_config: function () {
        var self = this;
        if (isString(self.type)) {
            return self.fallback_config[self.type];
        } else {
            return self.fallback_config.bypass;
        }
    },
    _extend: function (obj) {
        var self = this;
        new _Object(obj)._each(function (key, value) {
            self[key] = value;
        })
    }
};
var isNumber = function (value) {
    return (typeof value === 'number');
};
var isString = function (value) {
    return (typeof value === 'string');
};
var isBoolean = function (value) {
    return (typeof value === 'boolean');
};
var isObject = function (value) {
    return (typeof value === 'object' && value !== null);
};
var isFunction = function (value) {
    return (typeof value === 'function');
};
var MOBILE = /Mobi/i.test(navigator.userAgent);

var callbacks = {};
var status = {};

var random = function () {
    return parseInt(Math.random() * 10000) + (new Date()).valueOf();
};

// bind 鍑芥暟polify, 涓嶅甫new鍔熻兘鐨刡ind

var bind = function(target,context){
    if(typeof target !== 'function'){
        return;
    }
    var args = Array.prototype.slice.call(arguments,2);

    if(Function.prototype.bind){
        return target.bind(context, args);
    }else {
        return function(){
            var _args = Array.prototype.slice.call(arguments);
            return target.apply(context,args.concat(_args));
        }
    }
}



var toString = Object.prototype.toString;

var _isFunction = function(obj) {
  return typeof(obj) === 'function';
};
var _isObject = function(obj) {
  return obj === Object(obj);
};
var _isArray = function(obj) {
  return toString.call(obj) == '[object Array]';
};
var _isDate = function(obj) {
  return toString.call(obj) == '[object Date]';
};
var _isRegExp = function(obj) {
  return toString.call(obj) == '[object RegExp]';
};
var _isBoolean = function(obj) {
  return toString.call(obj) == '[object Boolean]';
};


function resolveKey(input){
  return  input.replace(/(\S)(_([a-zA-Z]))/g, function(match, $1, $2, $3){
          return $1 + $3.toUpperCase() || "";
  })
}

function camelizeKeys(input, convert){
  if(!_isObject(input) || _isDate(input) || _isRegExp(input) || _isBoolean(input) || _isFunction(input)){
      return convert ? resolveKey(input) : input;
  }

  if(_isArray(input)){
      var temp = [];
      for(var i = 0; i < input.length; i++){
          temp.push(camelizeKeys(input[i]));
      }

  }else {
      var temp = {};
      for(var prop in input){
          if(input.hasOwnProperty(prop)){
              temp[camelizeKeys(prop, true)] = camelizeKeys(input[prop]);
          }
      }
  }
  return temp;
}

var loadScript = function (url, cb, timeout) {
    var script = document.createElement("script");
    script.charset = "UTF-8";
    script.async = true;

    // 瀵筭eetest鐨勯潤鎬佽祫婧愭坊鍔� crossOrigin
    if ( /static\.geetest\.com/g.test(url)) {
        script.crossOrigin = "anonymous";
    }

    script.onerror = function () {
        cb(true);
        // 閿欒瑙﹀彂浜嗭紝瓒呮椂閫昏緫灏变笉鐢ㄤ簡
        loaded = true;
    };
    var loaded = false;
    script.onload = script.onreadystatechange = function () {
        if (!loaded &&
            (!script.readyState ||
            "loaded" === script.readyState ||
            "complete" === script.readyState)) {

            loaded = true;
            setTimeout(function () {
                cb(false);
            }, 0);
        }
    };
    script.src = url;
    head.appendChild(script);

    setTimeout(function () {
        if (!loaded) {
            script.onerror = script.onload = null;
            script.remove && script.remove();
            cb(true);
        }
    }, timeout || TIMEOUT);
};

var normalizeDomain = function (domain) {
    // special domain: uems.sysu.edu.cn/jwxt/geetest/
    // return domain.replace(/^https?:\/\/|\/.*$/g, ''); uems.sysu.edu.cn
    return domain.replace(/^https?:\/\/|\/$/g, ''); // uems.sysu.edu.cn/jwxt/geetest
};
var normalizePath = function (path) {
    path = path.replace(/\/+/g, '/');
    if (path.indexOf('/') !== 0) {
        path = '/' + path;
    }
    return path;
};
var normalizeQuery = function (query) {
    if (!query) {
        return '';
    }
    var q = '?';
    new _Object(query)._each(function (key, value) {
        if (isString(value) || isNumber(value) || isBoolean(value)) {
            q = q + encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
    });
    if (q === '?') {
        q = '';
    }
    return q.replace(/&$/, '');
};
var makeURL = function (protocol, domain, path, query) {
    domain = normalizeDomain(domain);

    var url = normalizePath(path) + normalizeQuery(query);
    if (domain) {
        url = protocol + domain + url;
    }

    return url;
};

var load = function (config, protocol, domains, path, query, cb, handleCb) {
    var tryRequest = function (at) {

        // 澶勭悊jsonp鍥炶皟锛岃繖閲屼负浜嗕繚璇佹瘡涓笉鍚宩sonp閮芥湁鍞竴鐨勫洖璋冨嚱鏁�
        if(handleCb){
            var cbName = "geetest_" + random();
            // 闇€瑕佷笌棰勫厛瀹氫箟濂絚bname鍙傛暟锛屽垹闄ゅ璞�
            window[cbName] = bind(handleCb, null, cbName);
            query.callback = cbName;
        }
        var url = makeURL(protocol, domains[at], path, query);
        loadScript(url, function (err) {
            if (err) {
                // 瓒呮椂鎴栬€呭嚭閿欑殑鏃跺€� 绉婚櫎鍥炶皟
                if(cbName){
                  try {
                     window[cbName] = function(){
                       window[cbName] = null;
                      }
                    } catch (e) {}
                }

                if (at >= domains.length - 1) {
                    cb(true);
                    // report gettype error
                } else {
                    tryRequest(at + 1);
                }
            } else {
                cb(false);
            }
        }, config.timeout);
    };
    tryRequest(0);
};


var jsonp = function (domains, path, config, callback) {

    var handleCb = function (cbName, data) {

        // 淇濊瘉鍙墽琛屼竴娆★紝鍏ㄩ儴瓒呮椂鐨勬儏鍐典笅涓嶄細鍐嶈Е鍙�;

        if (data.status == 'success') {
            callback(data.data);
        } else if (!data.status) {
            callback(data);
        } else {
            //鎺ュ彛鏈夎繑鍥烇紝浣嗘槸杩斿洖浜嗛敊璇姸鎬侊紝杩涘叆鎶ラ敊閫昏緫
            callback(data);
        }
        window[cbName] = undefined;
        try {
            delete window[cbName];
        } catch (e) {
        }
    };
    load(config, config.protocol, domains, path, {
        captcha_id: config.captchaId,
        challenge: config.challenge || uuid(),
        client_type: MOBILE? 'h5':'web',
        risk_type: config.riskType,
        user_info: config.userInfo,
        call_type: config.callType,
        lang: config.language? config.language : navigator.appName === 'Netscape' ? navigator.language.toLowerCase() : navigator.userLanguage.toLowerCase()
    }, function (err) {
        // 缃戠粶闂鎺ュ彛娌℃湁杩斿洖锛岀洿鎺ヤ娇鐢ㄦ湰鍦伴獙璇佺爜锛岃蛋瀹曟満妯″紡
        // 杩欓噷鍙互娣诲姞鐢ㄦ埛鐨勯€昏緫
            if(err && typeof config.offlineCb === 'function'){
                // 鎵ц鑷繁鐨勫畷鏈�
                config.offlineCb();
                return;
            }

           if(err){
            callback(config._get_fallback_config());
           }
    }, handleCb);
};

var reportError = function (config, url) {
    load(config, config.protocol, ['monitor.geetest.com'], '/monitor/send', {
        time: Date.now().getTime(),
        captcha_id: config.gt,
        challenge: config.challenge,
        exception_url: url,
        error_code: config.error_code
    }, function (err) {})
}

var throwError = function (errorType, config, errObj) {
    var errors = {
        networkError: '缃戠粶閿欒',
        gtTypeError: 'gt瀛楁涓嶆槸瀛楃涓茬被鍨�'
    };
    if (typeof config.onError === 'function') {
        config.onError({
            desc: errObj.desc,
            msg: errObj.msg,
            code: errObj.code
        });
    } else {
        throw new Error(errors[errorType]);
    }
};

var detect = function () {
    return window.Geetest || document.getElementById("gt_lib");
};

if (detect()) {
    status.slide = "loaded";
}
var GeetestIsLoad = function (fname) {
  var GeetestIsLoad = false;
  var tags = { js: 'script', css: 'link' };
  var tagname = tags[fname.split('.').pop()];
  if (tagname !== undefined) {
    var elts = document.getElementsByTagName(tagname);
    for (var i in elts) {
      if ((elts[i].href && elts[i].href.toString().indexOf(fname) > 0)
              || (elts[i].src && elts[i].src.toString().indexOf(fname) > 0)) {
        GeetestIsLoad = true;
      }
    }
  }
  return GeetestIsLoad;
};
window.initGeetest4 = function (userConfig,callback) {

    var config = new Config(userConfig);
    if (userConfig.https) {
        config.protocol = 'https://';
    } else if (!userConfig.protocol) {
        config.protocol = window.location.protocol + '//';
    }


    if (isObject(userConfig.getType)) {
        config._extend(userConfig.getType);
    }

    jsonp(config.apiServers , config.typePath, config, function (newConfig) {
            
            //閿欒鎹曡幏锛岀涓€涓猯oad璇锋眰鍙兘鐩存帴鎶ラ敊
            var newConfig = camelizeKeys(newConfig);

            if(newConfig.status === 'error'){
               return throwError('networkError', config, newConfig);
            }

            var type = newConfig.type;
            
            if(config.debug){
                new _Object(newConfig)._extend(config.debug)
            }
            var init = function () {
                config._extend(newConfig);
                callback(new window.Geetest4(config));
            };

            callbacks[type] = callbacks[type] || [];

            var s = status[type] || 'init';
            if (s === 'init') {

                status[type] = 'loading';

                callbacks[type].push(init);

                if(newConfig.gctPath){
                    load(config, config.protocol, Object.hasOwnProperty.call(config, 'staticServers') ? config.staticServers  : newConfig.staticServers || config.staticServers , newConfig.gctPath, null, function (err){
                        if(err){
                            throwError('networkError', config, {
                                code: '60205',
                                msg: 'Network failure',
                                desc: {
                                    detail: 'gct resource load timeout'
                                }
                            });
                        }
                    })
                }

                load(config,  config.protocol, Object.hasOwnProperty.call(config, 'staticServers') ? config.staticServers  : newConfig.staticServers || config.staticServers, newConfig.bypass || (newConfig.staticPath + newConfig.js), null, function (err) {
                    if (err) {
                        status[type] = 'fail';
                        throwError('networkError', config, {
                            code: '60204',
                            msg: 'Network failure',
                            desc: {
                                detail: 'js resource load timeout'
                            }
                        });
                    } else {
                        status[type] = 'loaded';
                        var cbs = callbacks[type];
                        for (var i = 0, len = cbs.length; i < len; i = i + 1) {
                            var cb = cbs[i];
                            if (isFunction(cb)) {
                                cb();
                            }
                        }
                        callbacks[type] = [];
                    }
                });
            } else if (s === "loaded") {
                // 鍒ゆ柇gct鏄惁闇€瑕侀噸鏂板姞杞�
                if(!GeetestIsLoad(newConfig.gctPath)){
                  load(config, config.protocol, Object.hasOwnProperty.call(config, 'staticServers') ? config.staticServers  : newConfig.staticServers || config.staticServers , newConfig.gctPath, null, function (err){
                      if(err){
                          throwError('networkError', config, {
                              code: '60205',
                              msg: 'Network failure',
                              desc: {
                                  detail: 'gct resource load timeout'
                              }
                          });
                      }
                  })
                }
                return  init();
            } else if (s === "fail") {
              throwError('networkError', config, {
                code: '60204',
                msg: 'Network failure',
                desc: {
                    detail: 'js resource load timeout'
                }
              });
            } else if (s === "loading") {
                callbacks[type].push(init);
            }
        });

};


})(window);