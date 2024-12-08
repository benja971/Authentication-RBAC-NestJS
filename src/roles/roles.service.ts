import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from 'src/commons/types';
import { User } from 'src/users/entities/user.entity';
import { Role } from './roles.enum';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  assertNoSelfAssignment(assigneeId: string, assignerId: string) {
    if (assigneeId === assignerId) {
      this.logger.error('User cannot assign a role to themselves');
      throw new ForbiddenException('You cannot assign a role to yourself');
    }
  }

  assertAssignerIsAdmin(assigner: JwtPayload) {
    if (!assigner.roles.includes(Role.Admin)) {
      this.logger.error('Only admins can assign this role');
      throw new ForbiddenException('Only admins can assign this role');
    }
  }

  async assignRoleToUser(user: User, role: Role) {
    if (user.roles.includes(role)) {
      this.logger.log(`User already has role: ${role}. Skipping assignment`);
      return user;
    }

    this.logger.log(`Assigning role: ${role} to user`);
    user.roles.push(role);
    return user;
  }

  async removeRoleFromUser(user: User, role: Role) {
    this.logger.log(`Removing role: ${role} from user`);

    user.roles = user.roles.filter((r) => r !== role);

    return user;
  }

  // --------------------------------------------------------
  // This are the methods that will be used for demo purposes

  getUserRestrictedData() {
    return 'This is a user restricted data';
  }

  getModeratorRestrictedData() {
    return 'This is a moderator restricted data';
  }

  getAdminRestrictedData() {
    return 'This is an admin restricted data';
  }
}
