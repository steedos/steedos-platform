const globby = require('globby');

export const syncMatchFiles = (patterns: string[], options: any = {}) => {
    return globby.sync(patterns.map((pattern)=>{ return pattern.replace(/\\/g, "/")}), options);
}