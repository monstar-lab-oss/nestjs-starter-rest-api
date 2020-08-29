import { IsNotEmpty, IsEmail, MaxLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}

export class RegisterOutput {
  id: number;
  name: string;
  email: string;
}
