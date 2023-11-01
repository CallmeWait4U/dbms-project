import { ICommand } from '@nestjs/cqrs';

export class SignUpCommand implements ICommand {
  username: string;
  password: string;
  passwordConfirm: string;

  constructor(readonly data: Partial<SignUpCommand>) {
    Object.assign(this, data);
  }
}
