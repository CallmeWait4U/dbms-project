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

  async signIn(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.generateTokenPair(user);
    await this.prisma.user.update({
      data: {
        refreshToken: tokens.refreshToken,
      },
      where: { id: user.id },
    });
    return tokens;
  }

  async signOut(id: number): Promise<void> {
    await this.prisma.user.update({
      data: {
        refreshToken: null,
      },
      where: { id },
    });
  }

  async refresh(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await this.generateTokenPair(user);
    await this.prisma.user.update({
      data: {
        refreshToken: tokens.refreshToken,
      },
      where: { id: user.id },
    });
    return tokens;
  }

  async generateTokenPair(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          username: user.username,
        },
        {
          secret: jwtConfig.access,
          expiresIn: jwtConfig.expiresIn.access,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          username: user.username,
        },
        {
          secret: jwtConfig.refresh,
          expiresIn: jwtConfig.expiresIn.refresh,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
