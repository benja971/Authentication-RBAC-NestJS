import { Body, Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthenticatedRequest, Public } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() registerUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.login(registerUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() { user }: AuthenticatedRequest): Promise<void> {
    return this.authService.logout(user.id);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Request() { user }: AuthenticatedRequest): Promise<{ accessToken: string }> {
    return this.authService.refresh(user);
  }
}
