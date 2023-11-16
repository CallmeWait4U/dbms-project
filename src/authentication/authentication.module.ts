import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { SignOutHandler } from './application/command-handler/signout.handler';
import { SignUpHandler } from './application/command-handler/signup.handler';
import { SignInHandler } from './application/query-handler/signin.handler';
import { AuthenticationQuery } from './infrastructure/authentication.query';
import { AuthenticationRepository } from './infrastructure/authentication.repository';
import { AuthenticationController } from './presentation/authentication.controller';
import { jwtConfig } from './presentation/jwt/jwt.config';
import { AccessTokenStrategy } from './presentation/jwt/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './presentation/jwt/strategies/refreshToken.strategy';

const application = [SignUpHandler, SignInHandler, SignOutHandler];

const infrastructure = [AuthenticationRepository, AuthenticationQuery];

const domain = [];

const strategies = [AccessTokenStrategy, RefreshTokenStrategy];

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConfig.access,
      signOptions: { expiresIn: jwtConfig.expiresIn.access },
    }),
    CqrsModule,
  ],
  providers: [...application, ...infrastructure, ...domain, ...strategies],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
