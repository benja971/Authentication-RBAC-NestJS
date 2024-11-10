import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'your@email.com' })
  readonly email: string;

  @ApiProperty({ example: 'password123' })
  readonly password: string;
}
