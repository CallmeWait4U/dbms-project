import { ICommand } from '@nestjs/cqrs';

export class SignOutCommand implements ICommand {
  id: number;

  constructor(readonly data: Partial<SignOutCommand>) {
    Object.assign(this, data);
  }
}
