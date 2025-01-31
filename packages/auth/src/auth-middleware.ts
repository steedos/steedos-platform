/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-11 17:35:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-26 10:48:24
 * @Description: 
 */
import { setRequestUser } from "./session";
import * as core from "express-serve-static-core";
import { compact, split, includes } from "lodash";
interface Request extends core.Request {
    user: any;
}

export const requireAuthentication = async (req: Request, res: any, next: () => void) => {
    await setRequestUser(req, res, function () {
        if (req.user) {
            next();
        }
        else {
            res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
        }
    });

}

export const authentication = async (req: Request, res: any, next: () => void) => {
    await setRequestUser(req, res, function () {
        next();
    });
}

export const superAdminAuthentication= async (req: Request, res: any, next: () => void) => {
    await setRequestUser(req, res, function () {
        if (req.user) {
            const { userId } = req.user;
            const superAdmins = compact(split(process.env.STEEDOS_SUPER_ADMIN, ','));
            if(includes(superAdmins, userId)){
                next();
            }else{
                res.status(403).send({ status: 'error', message: 'You do not have permission to do this.' });
            }
        }
        else {
            res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
        }
    });
}