import { addConfig, getConfig, removeConfig } from '../types';
const refMapName = '@@formula_ref_maps';
const refMapId = '@@formula_ref_maps_id';
const _ = require('underscore');

function checkRefMapData(maps, data){
    let refs = [];
    function checkInfiniteLoop(value){
        _.each(maps, function(item){
            if(item.value === value){
                refs.push(item.key);
                checkInfiniteLoop(item.key)
            }
        })
    }
    checkInfiniteLoop(data.key)
    if(_.find(refs, function(ref){return ref === data.value})){
        throw new Error(`Infinite Loop: ${JSON.stringify(data)}`);
    }
}

export function removeFormulaReferenceMaps(){
    removeConfig(refMapName, {_id: refMapId});
}

export function addFormulaReferenceMaps(key: string, value: string){
    let cache = getConfig(refMapName, refMapId);
    let maps = [];
    if(cache && cache.maps){
        maps = cache.maps;
    }

    let data = { 
        key: key,
        value: value
    }

    //checkData
    checkRefMapData(maps, data);

    maps.push(data);

    addConfig(refMapName, {_id: refMapId, maps: maps});
} 