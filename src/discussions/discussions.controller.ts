import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/auth.guard';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';

@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @ApiBearerAuth()
  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createDiscussionDto: CreateDiscussionDto) {
    const { user } = req;
    return this.discussionsService.create(createDiscussionDto, user.id);
  }
}
