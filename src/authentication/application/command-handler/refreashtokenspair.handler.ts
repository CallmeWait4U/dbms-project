import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticationQuery } from 'src/authentication/infrastructure/authentication.query';
import { AuthenticationRepository } from 'src/authentication/infrastructure/authentication.repository';
import { RefreshTokensPairCommand } from '../command/refreshtokenspair.command';

@CommandHandler(RefreshTokensPairCommand)
export class RefreshTokensPairHandler
  implements ICommandHandler<RefreshTokensPairCommand, any>
{
  @Inject()
  private readonly authenticationRepository: AuthenticationRepository;
  @Inject()
  private readonly authenticationQuery: AuthenticationQuery;

  async execute(
    command: RefreshTokensPairCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authenticationQuery.getUserById(command.data.id);
    if (
      !user ||
      !user.refreshToken ||
      command.data.refreshToken !== user.refreshToken
    ) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return await this.authenticationRepository.refresh(user);
  }
}
