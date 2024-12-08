import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';
import { ConfirmEmailDto } from 'src/auth/dto/confirm-email.dto';
import { AuthenticatedRequest } from 'src/auth/types';
import { RefreshTokensService } from 'src/tokens/refresh_tokens.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  @Public()
  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  confirmEmail(@Body() { token }: ConfirmEmailDto) {
    return this.usersService.confirmEmail(token);
  }

  @ApiBearerAuth()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Request() request: AuthenticatedRequest) {
    const { user } = request;
    return this.usersService.requestPasswordReset(user.id);
  }

  @ApiBearerAuth()
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Req() { user }: AuthenticatedRequest, @Body() { password, resetPasswordToken }: ChangePasswordDto) {
    const updatedUser = await this.usersService.updatePassword(user.id, password, resetPasswordToken);

    // revoke refresh token to prevent further access with the old password
    await this.refreshTokensService.deleteByUser(user.id);

    return updatedUser;
  }
}
