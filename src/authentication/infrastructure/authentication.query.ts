import { Inject } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'libs/database.module';

export class AuthenticationQuery {
  @Inject()
  private readonly prisma: DatabaseService;

  async getUserById(id: number): Promise<User | null> {
    const res = await this.prisma.user.findFirst({ where: { id } });
    return res ? res : null;
  }

  async findUser(username: string): Promise<User | null> {
    const res = await this.prisma.user.findFirst({ where: { username } });
    return res ? res : null;
  }
}
