import { ApiProperty } from '@nestjs/swagger';

import { ROLE } from '../constants/role.constant';

export class AuthTokenOutput {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class UserAccessTokenClaims {
  id: number;
  username: string;
  roles: ROLE[];
}

export class UserRefreshTokenClaims {
  id: number;
}
