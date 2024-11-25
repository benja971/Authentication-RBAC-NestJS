import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, Req, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest, Public } from 'src/auth/auth.guard';
import { AssignRoleToUserDto, AssignRoleToUserParams } from 'src/roles/dto/assign-role.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesService } from 'src/roles/roles.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';
import { ConfirmEmailDto } from 'src/auth/dto/confirm-email.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Public()
  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  confirmEmail(@Body() { token }: ConfirmEmailDto) {
    return this.usersService.confirmEmail(token);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Patch(':userId/roles')
  async assignRoleToUser(@Req() request: AuthenticatedRequest, @Param() { userId }: AssignRoleToUserParams, @Body() { role }: AssignRoleToUserDto) {
    const { user } = request;

    this.rolesService.assertNoSelfAssignment(userId, user.id);

    return this.usersService.assignRoleToUser(userId, role);
  }

  @ApiBearerAuth()
  @Post('forgot-password')
  async forgotPassword(@Request() request: AuthenticatedRequest) {
    const { user } = request;
    return this.usersService.requestPasswordReset(user.id);
  }

  @ApiBearerAuth()
  @Patch('change-password')
  async resetPassword(@Req() request: AuthenticatedRequest, @Body() { password, resetPasswordToken }: ChangePasswordDto) {
    const { user } = request;

    return this.usersService.updatePassword(user.id, password, resetPasswordToken);
  }
}
