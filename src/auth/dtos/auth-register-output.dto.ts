import { ApiProperty } from '@nestjs/swagger';

export class RegisterOutput {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  roles: string[];
}
