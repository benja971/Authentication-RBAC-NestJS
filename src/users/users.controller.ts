import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest, Public } from 'src/auth/auth.guard';
import { ConfirmEmailDto } from 'src/auth/dto/confirm-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  confirmEmail(@Body() { token }: ConfirmEmailDto) {
    return this.usersService.confirmEmail(token);
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
