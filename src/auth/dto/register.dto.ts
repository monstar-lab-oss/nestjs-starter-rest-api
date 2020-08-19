import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterInput {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
