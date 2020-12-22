import { uncompressPackages, getAllPackages} from '@steedos/metadata-core';
import { addAllConfigFiles, wrapAsync } from '@steedos/objectql';
import * as _ from 'underscore';
import * as path from 'path';

export function loadPackages(){
    wrapAsync(async function(){
        await uncompressPackages(process.cwd());
        const packages = await getAllPackages(process.cwd());
        packages.push(path.join(process.cwd(), 'steedos-app'));
        _.each(packages, function(filePath: string){
            addAllConfigFiles(path.join(filePath, '**'), null);
        })
    }, {})
}