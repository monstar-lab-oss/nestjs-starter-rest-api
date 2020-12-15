import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { ROLE } from '../../auth/constants/role.constant';

export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ROLE, { each: true })
  roles: ROLE[];
}
