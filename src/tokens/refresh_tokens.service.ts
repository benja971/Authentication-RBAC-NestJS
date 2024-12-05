import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh_token.entity';

@Injectable()
export class RefreshTokensService {
  private readonly logger = new Logger(RefreshTokensService.name);
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async create(userId: string, token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.save({ userId, token: token });
  }

  async findByUserId(userId: string): Promise<RefreshToken> {
    this.logger.verbose(`Finding refresh token for user with ID: ${userId}`);

    const refreshToken = await this.refreshTokenRepository.findOne({ where: { userId } });

    if (!refreshToken) {
      this.logger.error(`No refresh token found for user with ID: ${userId}`);
      throw new NotFoundException(`No refresh token found for user with ID: ${userId}`);
    }

    return refreshToken;
  }

  async deleteById(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ id: tokenId });
  }

  async update(tokenId: string, newToken: string): Promise<void> {
    await this.refreshTokenRepository.update({ id: tokenId }, { token: newToken });
  }
}
