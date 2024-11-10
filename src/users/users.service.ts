import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    this.logger.verbose(`Creating a new user: ${user.email}`);

    user.password = await this.hashingService.hash(user.password);
    this.logger.verbose(`Hashed password for user: ${user.email}`);

    this.logger.verbose(`Saving user: ${user.email}`);
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string) {
    this.logger.verbose(`Finding user by email: ${email}`);
    return this.usersRepository.findOne({ where: { email } });
  }
}
