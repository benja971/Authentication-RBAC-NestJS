import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class HashingService {
  constructor(private readonly configService: ConfigService) {}

  async hash(data: string): Promise<string> {
    const rounds = this.configService.get<number>('saltRounds');

    const salt = await bcrypt.genSalt(rounds);

    return bcrypt.hash(data, salt);
  }

  compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  async generateRandomToken(): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
  }
}
