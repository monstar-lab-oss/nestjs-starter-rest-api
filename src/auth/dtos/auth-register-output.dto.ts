import { ApiProperty } from '@nestjs/swagger';

import { ROLE } from '../constants/role.constant';

export class RegisterOutput {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  roles: ROLE[];
}
