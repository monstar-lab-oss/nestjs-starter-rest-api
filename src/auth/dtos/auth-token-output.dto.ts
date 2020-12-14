import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenOutput {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class UserAccessTokenClaims {
  id: number;
  username: string;
  roles: string[];
}

export class UserRefreshTokenClaims {
  id: number;
}
