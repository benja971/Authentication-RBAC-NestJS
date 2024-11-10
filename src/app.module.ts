import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import database from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configuration, database],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: database,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
