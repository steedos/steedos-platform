const Cookies = require('cookies');
const psl = require('psl');

const useSubdomainCookies = process.env.STEEDOS_AUTH_COOKIES_USE_SUBDOMAIN === 'true';
const sameSite = process.env.STEEDOS_AUTH_COOKIES_USE_SAMESITE || null;

// 从请求的 Host 头中提取二级域名部分
function getSubdomain(host) {
  const parsed = psl.parse(host);
  if (parsed && parsed.domain) {
    return parsed.domain;
  }
  return host;
}

export function setCookie(req, res, name, value, options = {domain: null, maxAge: 0, httpOnly: true, overwrite: true}) {
  const cookies = new Cookies(req, res);
  const host = req.headers.host;
  if(host && useSubdomainCookies && psl.isValid(host)){
    const domain = getSubdomain(host);
    options.domain = `.${domain}`; // 动态设置二级域名
  }

  if(sameSite){
    (options as any).sameSite = sameSite;
  }

  cookies.set(name, value, options);
}

export function clearCookie(req, res, name, options = {domain: null, maxAge: 0, httpOnly: true, overwrite: true}) {
  const cookies = new Cookies(req, res);
  const host = req.headers.host;
  if(host && useSubdomainCookies && psl.isValid(host)){
    const domain = getSubdomain(host);
    options.domain = `.${domain}`; // 动态设置二级域名
  }

  if(sameSite){
    (options as any).sameSite = sameSite;
  }

  options.maxAge = 0; // 通过将 maxAge 设置为 0 来清除 cookie
  cookies.set(name, null, options);
}