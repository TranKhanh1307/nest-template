import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from 'src/core/auth/events/user-registered.event';
import { UserService } from '../user.service';

@Injectable()
export class UserRegisteredListener {
  constructor(private userService: UserService) {}

  @OnEvent('user.registered', { async: true })
  handleUserRegistered(event: UserRegisteredEvent) {
    this.userService.create(event.user);
  }
}
