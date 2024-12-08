import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles.enum';

export class AssignRoleToUserDto {
  @ApiProperty({ enum: Role })
  role: Role;
}

export class AssignRoleToUserParams {
  @ApiProperty()
  targetUserId: string;
}
