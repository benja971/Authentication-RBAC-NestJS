import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/auth.guard';
import { AssignRoleToUserDto, AssignRoleToUserParams } from 'src/roles/dto/assign-role.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':userId/roles')
  async assignRoleToUser(@Req() request: AuthenticatedRequest, @Param() { userId }: AssignRoleToUserParams, @Body() { role }: AssignRoleToUserDto) {
    const { user } = request;

    this.rolesService.assertNoSelfAssignment(userId, user.id);

    return this.usersService.assignRoleToUser(userId, role);
  }
}
