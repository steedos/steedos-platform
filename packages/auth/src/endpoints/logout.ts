
import { Request, Response } from 'express-serve-static-core';
import { clearAuthCookies } from '../utils';

export const logout = async (req: Request, res: Response) => {
    clearAuthCookies(req, res);
    return res.end();
}