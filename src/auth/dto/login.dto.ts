import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class LoginInput {
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(200)
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class LoginOutput {
  @ApiResponseProperty()
  access_token: string;
}
