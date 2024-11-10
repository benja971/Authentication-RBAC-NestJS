import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user123' })
  readonly username: string;

  @ApiProperty({ example: 'your@email.com' })
  readonly email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  readonly password: string;
}
