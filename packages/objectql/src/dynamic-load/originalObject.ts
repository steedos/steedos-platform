import { getOriginalObjectConfig } from '../types';

var util = require('../util');

export function overrideOriginalObject(objectName, data){
    const originalObjectConfig = getOriginalObjectConfig(objectName);
    util.extend(originalObjectConfig, data);
}