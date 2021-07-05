const fs = require('fs');
const UglifyJS = require('uglify-es');
const path = require("path");
const crypto = require('crypto');
const JavaScriptObfuscator = require('javascript-obfuscator');
const glob = require('glob');

function getMD5(data){
    let md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}

function garble(inputFilePath, outputFilePath, context){
    let options = {
        toplevel: true,
        compress: {
            global_defs: {
                DEBUG: false
            },
            // passes: 2
        },
        // output: {
        //     beautify: false,
        //     preamble: "/* uglified */"
        // }
    };
    
    if(context){
        options.compress.global_defs["@SMD5"] = `"${'L---md5---L' + context.SMD5}"`
        options.compress.global_defs["@CMD5"] = `"${'L---md5---L' + context.CMD5}"`
    }
    var code = fs.readFileSync(inputFilePath, "utf8");
    var data = UglifyJS.minify(code, options);
    if(data.error){
        throw new Error(data.error);
    }
    var obfuscationResult = JavaScriptObfuscator.obfuscate(data.code,
        {
            compact: true,
            controlFlowFlattening: true,
            numbersToExpressions: true,
            simplify: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArrayEncoding: ['base64'],
            stringArrayThreshold: 1
        }
    );
    fs.writeFileSync(outputFilePath, obfuscationResult.getObfuscatedCode(), "utf8")
}

function garbleFiles(){
    let jsPaths = glob.sync(path.join('./lib/**', "*.js"));
    for (const jsPath of jsPaths) {
        garble(jsPath, jsPath)
    }

    let jsMapPaths = glob.sync(path.join('./lib/**', "*.js.map"));
    for (const jsMapPath of jsMapPaths) {
        fs.unlinkSync(jsMapPath)
    }
}

garbleFiles()