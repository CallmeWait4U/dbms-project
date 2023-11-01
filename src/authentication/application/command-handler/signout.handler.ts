import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticationRepository } from 'src/authentication/infrastructure/authentication.repository';
import { SignOutCommand } from '../command/signout.command';

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand, void> {
  @Inject()
  private readonly authenticationRepository: AuthenticationRepository;

  async execute(command: SignOutCommand): Promise<void> {
    // console.log(command);
    await this.authenticationRepository.signOut(command.data.id);
  }
}
