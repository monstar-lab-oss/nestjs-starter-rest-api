import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  username: string;
}
