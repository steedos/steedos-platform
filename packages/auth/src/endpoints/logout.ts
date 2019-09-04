
import * as express from 'express';
import { clearAuthCookies } from '../utils';

export const logout = async (req: express.Request, res: express.Response) => {
    clearAuthCookies(req, res);
}