import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from 'libs/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [DatabaseModule, PrismaClient, AuthenticationModule, BillModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
