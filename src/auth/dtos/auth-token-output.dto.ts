import { ApiProperty } from '@nestjs/swagger';

export class AuthToken {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class TokenUserIdentity {
  id: number;
}
