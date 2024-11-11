import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from 'src/commons/types';
import { User } from 'src/users/entities/user.entity';
import { Role } from './roles.enum';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor() {}

  assertNoSelfAssignment(assigneeId: string, assignerId: string) {
    if (assigneeId === assignerId) {
      throw new ForbiddenException('You cannot assign a role to yourself');
    }
  }

  assertAssignerIsAdmin(assigner: JwtPayload) {
    if (!assigner.roles.includes(Role.Admin)) {
      throw new ForbiddenException('Only admins can assign roles');
    }
  }

  async assignRoleToUser(user: User, role: Role) {
    if (!user.roles.includes(role)) {
      user.roles.push(role);
    }

    this.logger.debug(`Saving user with new role: ${role}`);
    return user;
  }

  async removeRoleFromUser(user: User, role: Role) {
    user.roles = user.roles.filter((r) => r !== role);

    this.logger.debug(`Saving user with removed role: ${role}`);
    return user;
  }

  async getUserRestrictedData() {
    return 'This is a user restricted data';
  }

  async getModeratorRestrictedData() {
    return 'This is a moderator restricted data';
  }

  async getAdminRestrictedData() {
    return 'This is an admin restricted data';
  }
}
