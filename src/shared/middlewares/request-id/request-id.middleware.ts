import { REQUEST_ID_TOKEN_HEADER } from '../../constants';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'

export const RequestIdMiddleware = (req: Request, res: Response, next: () => void): void => {
  /** set request id, if not being set yet */
  if (!req.headers[REQUEST_ID_TOKEN_HEADER]) {
    req.headers[REQUEST_ID_TOKEN_HEADER] = uuidv4()
  }

  /** set rer id in response from req */
  res.set(REQUEST_ID_TOKEN_HEADER, req.headers[REQUEST_ID_TOKEN_HEADER]);
  next();
};

