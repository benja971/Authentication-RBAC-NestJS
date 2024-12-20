import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('public')
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @Get('protected')
  getProtected(): string {
    return this.appService.getProtected();
  }
}
