import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly resetPasswordToken: string;
}
