import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { AuthenticationQuery } from 'src/authentication/infrastructure/authentication.query';
import { AuthenticationRepository } from 'src/authentication/infrastructure/authentication.repository';
import { SignInQuery } from '../query/signin.query';

@QueryHandler(SignInQuery)
export class SignInHandler implements IQueryHandler<SignInQuery, any> {
  @Inject()
  private readonly authenticationQuery: AuthenticationQuery;
  @Inject()
  private readonly authenticationRepository: AuthenticationRepository;

  async execute(query: SignInQuery): Promise<any> {
    const user = await this.authenticationQuery.findUser(query.username);
    if (!user) {
      throw new HttpException('Wrong Username', HttpStatus.BAD_REQUEST);
    }
    const match = await bcrypt.compare(query.password, user.password);
    if (!match) {
      throw new HttpException('Wrong Password', HttpStatus.BAD_REQUEST);
    }
    return await this.authenticationRepository.signIn(user);
  }
}
