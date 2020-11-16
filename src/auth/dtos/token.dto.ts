import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AuthToken {
  @ApiResponseProperty()
  access_token: string;

  @ApiResponseProperty()
  refresh_token?: string;
}

export class RefreshTokenInput {
  @IsNotEmpty()
  @ApiProperty()
  refresh_token: string;
}

export class RefreshTokenOutput extends AuthToken {}
