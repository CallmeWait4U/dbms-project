import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticationRepository } from 'src/authentication/infrastructure/authentication.repository';
import { SignUpCommand } from '../command/signup.command';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand, any> {
  @Inject()
  private readonly authenticationRepository: AuthenticationRepository;

  async execute(command: SignUpCommand): Promise<any> {
    if (command.password !== command.passwordConfirm) {
      throw new HttpException('Wrong Comfirm', HttpStatus.BAD_REQUEST);
    }
    return await this.authenticationRepository.createUser(command);
  }
}
