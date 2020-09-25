import steedosAuth = require("@steedos/auth");
import { Response } from 'express';
import * as core from "express-serve-static-core";
interface Request extends core.Request {
    user: any;
}

export const requireAuthentication = async (req: Request, res: Response, next: () => void)=>{
    await steedosAuth.setRequestUser(req, res, function(){
        if (req.user) {
            next();
        }
        else {
            res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
        }
    });
    
}