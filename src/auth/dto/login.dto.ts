import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class LoginInput {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class LoginOutput {
  @ApiResponseProperty()
  access_token: string;
}
