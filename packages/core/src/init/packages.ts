import { getPackages} from '@steedos/metadata-core';
import { addAllConfigFiles, wrapAsync } from '@steedos/objectql';
import * as _ from 'underscore';
import * as path from 'path';

export function loadPackages(){
    wrapAsync(async function(){
        const packages = await getPackages(process.cwd());
        _.each(packages, function(filePath: string){
            addAllConfigFiles(path.join(filePath, '**'), null);
        })
    }, {})
}