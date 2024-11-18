import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingService } from 'src/hashing/hashing.service';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UsersService, HashingService, RolesService],
})
export class NotificationsModule {}
