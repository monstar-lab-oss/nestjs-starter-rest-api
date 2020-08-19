import { IsNotEmpty, IsEmail } from 'class-validator';

export class AddUserInput {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
