import * as express from 'express';
import { LoginResult } from '@accounts/types';

export type OAuthSuccessCallback = (
  req: express.Request,
  res: express.Response,
  login: LoginResult
) => void;
export type OAuthErrorCallback = (req: express.Request, res: express.Response, error: any) => void;
export type TransformOAuthResponse<T = LoginResult> = (login: LoginResult) => T;

export interface AccountsExpressOptions {
  path?: string;
  onOAuthSuccess?: OAuthSuccessCallback;
  onOAuthError?: OAuthErrorCallback;
  transformOAuthResponse?: TransformOAuthResponse;
}
