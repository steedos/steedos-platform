import * as _ from 'underscore';
const _eval = require('eval');
const beautify = require('js-beautify').js;

export function safeEval(scriptStr, hasExports: boolean = false){
    try{
        let script = `module.exports = ${scriptStr};`;
        if(hasExports){
            script = scriptStr;
        }
        // console.log("script", script);
        const func = _eval(script, "safeEval");
		return func;
	}catch (e){
		console.error(e, scriptStr);
	}
}

export function stringToFunction(strFun){
    if(_.isString(strFun) && strFun.startsWith('function')){
        return safeEval(`(${strFun})`);
    }else{
        return strFun;
    }
}

export function functionToString(fun){
    if(_.isFunction(fun)){
        return (fun + '').replace('function anonymous', 'function').replace("function(\n", 'function(').replace("function() {\n", 'function() {').replace(/(.*)\n}/g, "}");
    }else{
        return fun;
    }
}

export function beautifyScript(scriptStr: string){
    if(scriptStr && _.isString(scriptStr)){
        return beautify(scriptStr, { indent_size: 4, space_in_empty_paren: true });
    }
}