import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginOutput {
  @ApiResponseProperty()
  access_token: string;
}
