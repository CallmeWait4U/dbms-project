import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/auth.guard';
import { GetUser } from 'libs/getuser.decorator';
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async signOut(@GetUser() user: { id: string; username: string }) {
    const command = new SignOutCommand({ id: user.id });
    await this.commandBus.execute(command);
  }
}
