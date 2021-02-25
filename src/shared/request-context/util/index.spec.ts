import { Request } from 'express';

import { UserAccessTokenClaims } from '../../../auth/dtos/auth-token-output.dto';
import { createRequestContext } from '.';

describe('createRequestContext function', () => {
  const user = new UserAccessTokenClaims();
  const request = ({
    url: 'someUrl',
    ip: 'someIP',
    headers: {
      'x-request-id': '123',
    },
    user,
  } as unknown) as Request;

  const expectedOutput = {
    url: 'someUrl',
    ip: 'someIP',
    requestID: '123',
    user,
  };

  it('should return RequestContext', () => {
    expect(createRequestContext(request)).toEqual(expectedOutput);
  });
});
