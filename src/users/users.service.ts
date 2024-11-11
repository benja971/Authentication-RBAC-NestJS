import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maybe } from 'src/commons/types';
import { HashingService } from 'src/hashing/hashing.service';
import { Role } from 'src/roles/roles.enum';
import { RolesService } from 'src/roles/roles.service';
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
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Maybe<User>> {
    const user = this.usersRepository.create(createUserDto);
    this.logger.debug(`Creating a new user: ${user.email}`);

    try {
      user.password = await this.hashingService.hash(user.password);
      this.logger.debug(`Hashed password for user: ${user.email}`);

      this.logger.debug(`Saving user: ${user.email}`);
      return [null, await this.usersRepository.save(user)];
    } catch (error) {
      this.logger.error(`Failed to create user: ${user.email}`);
      return [error, null];
    }
  }

  async findOneByEmail(email: string) {
    this.logger.debug(`Finding user by email: ${email}`);

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`User with email: ${email} not found`);
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    return user;
  }

  async findOneById(id: string) {
    this.logger.debug(`Finding user by ID: ${id}`);

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User with ID: ${id} not found`);
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    return user;
  }

  async assignRoleToUser(userId: string, role: Role) {
    this.logger.debug(`Assigning role ${role} to user with ID: ${userId}`);

    const user = await this.findOneById(userId);
    const updatedUser = await this.rolesService.assignRoleToUser(user, role);

    return await this.usersRepository.save(updatedUser);
  }
}
