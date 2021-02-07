import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class AuthorOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;
}
