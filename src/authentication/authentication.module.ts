import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokensPairHandler } from './application/command-handler/refreashtokenspair.handler';
import { SignOutHandler } from './application/command-handler/signout.handler';
import { SignUpHandler } from './application/command-handler/signup.handler';
import { SignInHandler } from './application/query-handler/signin.handler';
import { AuthenticationQuery } from './infrastructure/authentication.query';
import { AuthenticationRepository } from './infrastructure/authentication.repository';
import { AuthenticationController } from './presentation/authentication.controller';
import { AccessTokenStrategy } from './presentation/jwt/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './presentation/jwt/strategies/refreshToken.strategy';

const application = [
  SignUpHandler,
  SignInHandler,
  SignOutHandler,
  RefreshTokensPairHandler,
];

const infrastructure = [AuthenticationRepository, AuthenticationQuery];

const domain = [];

const strategies = [AccessTokenStrategy, RefreshTokenStrategy];

@Module({
  imports: [JwtModule.register({}), CqrsModule],
  providers: [...application, ...infrastructure, ...domain, ...strategies],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
