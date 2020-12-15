import { IsNotEmpty, MaxLength, Length, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from '../constants/role.constant';

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty()
  @MaxLength(200)
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  // TODO : Setting default role as USER here. Will add option to change this later via ADMIN users.
  roles: ROLE[] = [ROLE.USER];
}
