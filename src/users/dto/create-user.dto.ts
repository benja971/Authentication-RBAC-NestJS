import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Benjamin' })
  readonly username?: string;

  @ApiProperty({ example: 'nddm.benjamin@gmail.com' })
  readonly email: string;

  @ApiProperty({ example: 'Password@123', minLength: 8 })
  readonly password: string;
}
