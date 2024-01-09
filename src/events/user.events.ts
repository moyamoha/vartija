import { UserDocument } from 'src/schemas/user.schema';

export class TempPasswordEvent {
  user: UserDocument;
  randomPassword: string;

  constructor(user: UserDocument, pass: string) {
    this.randomPassword = pass;
    this.user = user;
  }
}
