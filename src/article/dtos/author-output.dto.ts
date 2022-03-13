import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthorOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;
}
