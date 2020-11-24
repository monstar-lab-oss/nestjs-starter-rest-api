import { ApiResponseProperty } from '@nestjs/swagger';

export class TokenUserIdentity {
  id: number;
}

export class TokenUser extends TokenUserIdentity {
  email: string;
}

export class AuthToken {
  @ApiResponseProperty()
  access_token: string;

  @ApiResponseProperty()
  refresh_token?: string;
}
