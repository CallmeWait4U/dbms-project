import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'libs/getuser.decorator';
import { RefreshTokensPairCommand } from '../application/command/refreshtokenspair.command';
import { SignOutCommand } from '../application/command/signout.command';
import { SignUpCommand } from '../application/command/signup.command';
import { SignInQuery } from '../application/query/signin.query';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDTO) {
    const command = new SignUpCommand(body);
    await this.commandBus.execute(command);
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDTO) {
    const query = new SignInQuery(body);
    return await this.queryBus.execute(query);
  }

  @Post('sign-out')
  @UseGuards(AuthGuard('jwt'))
  async signOut(@GetUser() user: any) {
    const command = new SignOutCommand({ id: user.id });
    await this.commandBus.execute(command);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshTokensPair(@GetUser() user: any) {
    const command = new RefreshTokensPairCommand({
      id: user.id,
      refreshToken: user.refreshToken,
    });
    return await this.commandBus.execute(command);
  }
}
