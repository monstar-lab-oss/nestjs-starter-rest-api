import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { RequestContext } from './request-context.dto';

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();

    const requestContext = new RequestContext();
    requestContext.requestID = request.header(REQUEST_ID_TOKEN_HEADER);

    // If request.user does not exist, we explicitly set it to null.
    requestContext.user = request.user ? request.user : null;

    return requestContext;
  },
);
