import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from 'src/auth/dto/login-auth.dto';
import { HashingService } from 'src/hashing/hashing.service';
import { NotificationType } from 'src/notifications/notification-types.enum';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
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
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  private async onModuleInit() {
    try {
      await this.findOneByEmail('admin@weaverize.com');
    } catch (error) {
      if (error instanceof NotFoundException) {
        const emailConfirmationToken = await this.hashingService.generateRandomToken();
        const password = await this.hashingService.hash('Admin@123');

        const user: User = this.usersRepository.create({
          email: 'admin@weaverize.com',
          password,
          roles: [Role.Admin],
          emailConfirmationToken,
          username: 'admin',
          emailConfirmedAt: new Date(),
        });

        await this.usersRepository.save(user);
      }
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating a new user: ${createUserDto.email}`);

    const user = this.usersRepository.create(createUserDto);

    try {
      user.password = await this.hashingService.hash(user.password);
      user.emailConfirmationToken = await this.hashingService.generateRandomToken();

      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(error);

      if (error.code === '23505') {
        this.logger.error('User already exists');
        throw new ConflictException('User already exists');
      }

      this.logger.error('Failed to create user');
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    this.logger.log(`Finding user by email: ${email}`);

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.error(`User with email: ${email} not found`);
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    return user;
  }

  async findOneById(id: string): Promise<User> {
    this.logger.log(`Finding user by ID: ${id}`);

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.error(`User with ID: ${id} not found`);
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    return user;
  }

  async assignRoleToUser(userId: string, role: Role): Promise<User> {
    this.logger.log(`Assigning role ${role} to user with ID: ${userId}`);

    const user = await this.findOneById(userId);
    const updatedUser = await this.rolesService.assignRoleToUser(user, role);

    return await this.usersRepository.save(updatedUser);
  }

  async validateCredentials(loginUserDto: LoginUserDto): Promise<User> {
    this.logger.log(`Validating credentials for user with email: ${loginUserDto.email}`);

    const user = await this.findOneByEmail(loginUserDto.email);

    if (!(await this.hashingService.compare(loginUserDto.password, user.password))) {
      this.logger.error(`Login failed for email: ${loginUserDto.email}`);
      throw new UnauthorizedException(`Invalid credentials`);
    }

    return user;
  }

  async confirmEmail(emailConfirmationToken: string): Promise<User> {
    this.logger.log(`Confirming email for user with token: ${emailConfirmationToken}`);

    const user = await this.usersRepository.findOne({ where: { emailConfirmationToken } });

    if (!user) {
      this.logger.error(`User with token: ${emailConfirmationToken} not found`);
      throw new NotFoundException(`User with token: ${emailConfirmationToken} not found`);
    }

    user.emailConfirmedAt = new Date();

    const updatedUser = await this.usersRepository.save(user);

    const notifications: NotificationType[] = [NotificationType.E_Welcome];
    await this.notificationsGateway.sendNotification(notifications, user);

    return updatedUser;
  }

  async requestPasswordReset(userId: string): Promise<User> {
    this.logger.log(`Requesting password reset for user with ID: ${userId}`);

    const user = await this.findOneById(userId);

    user.resetPasswordToken = await this.hashingService.generateRandomToken();

    return await this.usersRepository.save(user);
  }

  async updatePassword(userId: string, password: string, resetPasswordToken: string): Promise<User> {
    this.logger.log(`Updating password for user with ID: ${userId}`);

    const user = await this.usersRepository.findOne({ where: { id: userId, resetPasswordToken } });

    if (!user) {
      this.logger.error(`User with ID: ${userId} and reset password token: ${resetPasswordToken} not found`);
      throw new NotFoundException(`User with ID: ${userId} and reset password token: ${resetPasswordToken} not found`);
    }

    user.password = await this.hashingService.hash(password);
    user.resetPasswordToken = null;

    return await this.usersRepository.save(user);
  }
}
