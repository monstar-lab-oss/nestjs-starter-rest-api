import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { AuthToken } from './token.dto';

export class LoginInput {
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(200)
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class LoginOutput extends AuthToken {}
