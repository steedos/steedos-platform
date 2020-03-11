import { detect } from 'detect-browser';
const browser = detect();
console.log(`The browser detected by "detect-browser" is `, browser);
if(browser){
    const browserName = browser.name && browser.name.toLowerCase();
    const browserOs = browser.os && browser.os.toLowerCase();
    let isValidBrowser = ["chrome", "safari", "edge", "ie"].indexOf(browserName) > -1;
    if(!isValidBrowser && ["ios", "android"].indexOf(browserOs) > -1){
        // ios及android平台认为是手机端，直接验证通过
        isValidBrowser = true;
    }
    if(isValidBrowser){
        if(browserName === "ie" && parseInt(browser.version) < 11){
            isValidBrowser = false;
        }
    }
    if(!isValidBrowser){
        console.error(`Steedos dont support the browser ${browser.name} yet.`);
        // 不支持浏览器时，直接跳转到说明界面
        window.location.href = "/accounts/a/browsers.html";
    }
}