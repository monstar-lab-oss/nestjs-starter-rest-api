import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class RefreshTokenInput {
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}
