import { Injectable } from '@nestjs/common';
import { UserRegisteredEvent } from 'src/core/auth/events/user-registered.event';
import { EmailService } from '../email.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserRegisteredListener {
  constructor(private emailService: EmailService) {}

  @OnEvent('user.registered', { async: true })
  handleUserRegistered(event: UserRegisteredEvent) {
    this.emailService.sendEmail(event.user.username);
  }
}
