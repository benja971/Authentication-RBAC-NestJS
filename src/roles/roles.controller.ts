import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth()
  @Roles(Role.User)
  @Get('user-role')
  async getUserRestrictedData() {
    return this.rolesService.getUserRestrictedData();
  }

  @ApiBearerAuth()
  @Roles(Role.Moderator)
  @Get('moderator-role')
  async getModeratorRestrictedData() {
    return this.rolesService.getModeratorRestrictedData();
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get('admin-role')
  async getAdminRestrictedData() {
    return this.rolesService.getAdminRestrictedData();
  }
}
