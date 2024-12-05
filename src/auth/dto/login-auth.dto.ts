import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'admin@weaverize.com' })
  readonly email: string;

  @ApiProperty({ example: 'Admin@123' })
  readonly password: string;
}
