import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, UserJwtPayload } from 'src/auth/types';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh_token.entity';

@Injectable()
export class RefreshTokensService {
  private readonly logger = new Logger(RefreshTokensService.name);
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generate(payload: UserJwtPayload): string {
    this.logger.log(`Signing refresh token for user ${payload.email}`);
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });
  }

  verify(token: string): boolean {
    this.logger.log(`Verifying refresh token`);
    try {
      return !!this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch (error) {
      this.logger.error(`Error verifying refresh token: ${error}`);
      return false;
    }
  }

  async create(userId: string, token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.save({ userId, token: token });
  }

  async findByUserId(userId: string): Promise<RefreshToken> {
    this.logger.verbose(`Finding refresh token for user with ID: ${userId}`);

    const refreshToken = await this.refreshTokenRepository.findOne({ where: { user: { id: userId } } });

    if (!refreshToken) {
      this.logger.error(`No refresh token found for user with ID: ${userId}`);
      throw new NotFoundException(`No refresh token found for user with ID: ${userId}`);
    }

    return refreshToken;
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { id: userId } });
  }

  async update(tokenId: string, newToken: string): Promise<void> {
    await this.refreshTokenRepository.update({ id: tokenId }, { token: newToken });
  }
}
