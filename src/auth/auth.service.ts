import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    this.logger.log(`Registering user with email: ${registerUserDto.email}`);

    const [error, user] = await this.usersService.create(registerUserDto);

    if (error) {
      throw new ForbiddenException();
    }

    return {
      access_token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      }),
    };
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

    return {
      access_token: await this.jwtService.signAsync({
        id: result.id,
        email: result.email,
      }),
    };
  }
}
