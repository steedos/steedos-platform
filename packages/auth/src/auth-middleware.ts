/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-11 17:35:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-02 09:13:26
 * @Description: 
 */
import { setRequestUser } from "./session";
import { Response } from 'express-serve-static-core';
import * as core from "express-serve-static-core";
interface Request extends core.Request {
    user: any;
}

export const requireAuthentication = async (req: Request, res: Response, next: () => void) => {
    await setRequestUser(req, res, function () {
        if (req.user) {
            next();
        }
        else {
            res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
        }
    });

}

export const authentication = async (req: Request, res: Response, next: () => void) => {
    await setRequestUser(req, res, function () {
        next();
    });
}