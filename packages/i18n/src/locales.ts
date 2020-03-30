import { getResourceBundle } from './index';

export const locales = async (req: any, res: any) => {
    console.log('locales run...');
    let ns = req.params.ns;
    if(ns == 'all'){
        ns = null;
    }
    res.send(getResourceBundle(req.params.lng, ns));
}