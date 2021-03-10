import { Request } from 'express';

import { UserAccessTokenClaims } from '../../../auth/dtos/auth-token-output.dto';
import { createRequestContext } from '.';
import {
  FORWARDED_FOR_TOKEN_HEADER,
  REQUEST_ID_TOKEN_HEADER,
} from '../../constants';

describe('createRequestContext function', () => {
  const user = new UserAccessTokenClaims();
  const request = ({
    url: 'someUrl',
    ip: 'someIP',

    user,
    header: jest.fn().mockImplementation((header) => {
      switch (header) {
        case REQUEST_ID_TOKEN_HEADER:
          return '123';
        case FORWARDED_FOR_TOKEN_HEADER:
          return 'forwardedIP';
        default:
          break;
      }
    }),
  } as unknown) as Request;

  const expectedOutput = {
    url: 'someUrl',
    ip: 'forwardedIP',
    requestID: '123',
    user,
  };

  it('should return RequestContext', () => {
    expect(createRequestContext(request)).toEqual(expectedOutput);
  });
});
