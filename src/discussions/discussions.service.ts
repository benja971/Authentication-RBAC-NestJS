import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { Discussion } from './entities/discussion.entity';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private readonly discussionsRepository: Repository<Discussion>,
  ) {}

  create(createDiscussionDto: CreateDiscussionDto, creatorId: string) {
    const discussion = this.discussionsRepository.create(createDiscussionDto);

    const user: User = new User();
    user.id = creatorId;

    discussion.members = [user];

    return this.discussionsRepository.save(discussion);
  }
}
