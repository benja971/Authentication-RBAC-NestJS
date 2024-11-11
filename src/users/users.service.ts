import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maybe } from 'src/commons/types';
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

  async create(createUserDto: CreateUserDto): Promise<Maybe<User>> {
    const user = this.usersRepository.create(createUserDto);
    this.logger.verbose(`Creating a new user: ${user.email}`);

    try {
      user.password = await this.hashingService.hash(user.password);
      this.logger.verbose(`Hashed password for user: ${user.email}`);

      this.logger.verbose(`Saving user: ${user.email}`);
      return [null, await this.usersRepository.save(user)];
    } catch (error) {
      this.logger.error(`Failed to create user: ${user.email}`);
      return [error, null];
    }
  }

  async findOneByEmail(email: string) {
    this.logger.verbose(`Finding user by email: ${email}`);
    return this.usersRepository.findOne({ where: { email } });
  }
}
