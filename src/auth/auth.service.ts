import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HashingService } from 'src/hashing/hashing.service';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    this.logger.log(`Registering user with email: ${registerUserDto.email}`);
    const user = await this.usersService.create(registerUserDto);

    return user;
  }

  async login(registerUserDto: LoginUserDto) {
    this.logger.log(`Logging in user with email: ${registerUserDto.email}`);
    const user = await this.usersService.findOneByEmail(registerUserDto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;

    if (
      !(await this.hashingService.compare(registerUserDto.password, password))
    ) {
      throw new UnauthorizedException();
    }

    return result;
  }
}
