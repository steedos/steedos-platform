import { getResourceBundle, getDataByLanguage } from './index';

export const locales = async (req: any, res: any) => {
    let ns = req.params.ns;
    console.log('locales', ns);
    if(ns == 'all'){
        res.send(getDataByLanguage(req.params.lng));
    }else{
        res.send(getResourceBundle(req.params.lng, ns));
    }
}