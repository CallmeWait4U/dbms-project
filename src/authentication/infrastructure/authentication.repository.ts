import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'libs/database.module';
import { SignUpCommand } from '../application/command/signup.command';
import { jwtConfig } from '../presentation/jwt/jwt.config';

export class AuthenticationRepository {
  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly prisma: DatabaseService;

  async createUser(command: SignUpCommand) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(command.password, salt);
    const data = {
      username: command.username,
      password: hashPassword,
    };
    await this.prisma.user.create({
      data,
    });
  }

  async signIn(user: User): Promise<string> {
    const accessToken = await this.generateTokenPair(user);
    await this.prisma.user.update({
      data: {
        accessToken,
      },
      where: { id: user.id },
    });
    return accessToken;
  }

  async signOut(id: number): Promise<void> {
    await this.prisma.user.update({
      data: {
        accessToken: null,
      },
      where: { id },
    });
  }

  async generateTokenPair(user: User): Promise<string> {
    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        username: user.username,
      },
      {
        secret: jwtConfig.access,
        expiresIn: jwtConfig.expiresIn.access,
      },
    );
    return accessToken;
  }
}
