import { REQUEST_ID_TOKEN_HEADER } from './../../constant';
import { v4 as uuidv4 } from 'uuid'

export const RequestIdMiddleware = (req: any, res: any, next: () => void) => {
  /** set request id, if not being set yet */
  if (!req.headers[REQUEST_ID_TOKEN_HEADER]) {
    req.headers[REQUEST_ID_TOKEN_HEADER] = uuidv4()
  }

  /** set rer id in response from req */
  res.set(REQUEST_ID_TOKEN_HEADER, req.headers[REQUEST_ID_TOKEN_HEADER]);
  next();
};

