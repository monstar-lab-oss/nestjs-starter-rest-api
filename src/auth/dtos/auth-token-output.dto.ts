import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenOutput {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class TokenUserIdentity {
  id: number;
}
