import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
