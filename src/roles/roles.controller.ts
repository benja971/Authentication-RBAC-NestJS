import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/types';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';
import { UsersService } from 'src/users/users.service';
import { AssignRoleToUserDto, AssignRoleToUserParams } from './dto/assign-role.dto';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly refreshTokenService: RefreshTokensService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch('users/:targetUserId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignRoleToUser(@Request() { user }: AuthenticatedRequest, @Param() { targetUserId }: AssignRoleToUserParams, @Body() { role }: AssignRoleToUserDto) {
    this.rolesService.assertNoSelfAssignment(targetUserId, user.id);

    await this.usersService.assignRoleToUser(targetUserId, role);

    // revoke refresh token to force user to re-login and get new token with updated roles
    await this.refreshTokenService.deleteByUser(targetUserId);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @Get('user-role')
  @HttpCode(HttpStatus.OK)
  async getUserRestrictedData() {
    return this.rolesService.getUserRestrictedData();
  }

  @ApiBearerAuth()
  @Roles(Role.Moderator)
  @Get('moderator-role')
  @HttpCode(HttpStatus.OK)
  async getModeratorRestrictedData() {
    return this.rolesService.getModeratorRestrictedData();
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('admin-role')
  @HttpCode(HttpStatus.OK)
  async getAdminRestrictedData() {
    return this.rolesService.getAdminRestrictedData();
  }
}
