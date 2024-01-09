import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserDocument } from 'src/schemas/user.schema';
import {
  accountDeactivedEmailResp,
  accountDeletedEmailResp,
  mfaDisabledEmailResp,
  mfaEnabledEmailResp,
} from 'src/utils/constants';
import { TempPasswordEvent } from './user.events';

@Injectable()
export class UserListenerService {
  constructor(private mailerService: MailerService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(user: UserDocument) {
    const confirmationLink = `${process.env.SITE_ADDRESS}/users/confirm/?id=${user._id}`;
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      text: 'Welcome to Guardian',
      subject: 'Welcome to Guardian',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>We are glad you chose Guardian to keep your passwords safe and secure. 
      Before you can do anything, please confirm your email address by clicking <a href="${confirmationLink}">This link</a>
      <br></br><i>Team Guardian.</i></p>`,
    });
  }

  @OnEvent('user.deleted')
  async handleUserAccountDeleted(user: UserDocument) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Your account was DELETED',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${accountDeletedEmailResp}
        <br></br><i>Team Guardian.</i></p>`,
    });
  }

  @OnEvent('user.deactivated')
  async handleUserDeactivated(user: UserDocument) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Your account is DEACTIVATED',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${accountDeactivedEmailResp}
        <br></br><i>Team Guardian.</i></p>`,
    });
  }

  @OnEvent('user.disabled-mfa')
  async handleUserDisabledMfa(user: UserDocument) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Oops! your account is VULNERABLE',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${mfaDisabledEmailResp}
            <br></br><i>Team Guardian.</i></p>`,
    });
  }

  @OnEvent('user.enabled-mfa')
  async handleUserEnabledMfa(user: UserDocument) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: user.email,
      subject: 'Your account is now SECURE',
      html: `<p><strong>Dear ${user.firstname}!</strong><br></br>${mfaEnabledEmailResp}
        <br></br><i>Team Guardian.</i></p>`,
    });
  }

  @OnEvent('send-temp-password')
  async handleSendTemporaryPassword(event: TempPasswordEvent) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_SENDER,
      to: event.user.email,
      subject: 'Reset password',
      html: `<p><strong>Dear ${event.user.firstname}!</strong><br></br>Use this password: <strong>${event.randomPassword}</strong> to log in. Please make sure to change it after you log in </strong>
            <br></br><i>Team Guardian.</i></p>`,
    });
  }
}
