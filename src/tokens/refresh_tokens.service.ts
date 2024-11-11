import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh_token.entity';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async create(userId: string, token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.save({ userId, token: token });
  }

  findByUserId(userId: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({ where: { userId } });
  }

  async deleteById(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ id: tokenId });
  }

  async update(tokenId: string, newToken: string): Promise<void> {
    await this.refreshTokenRepository.update({ id: tokenId }, { token: newToken });
  }
}
