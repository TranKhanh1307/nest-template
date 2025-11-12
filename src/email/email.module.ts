import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserRegisteredListener } from './listeners/user-registered.listener';

@Module({
  providers: [EmailService, UserRegisteredListener],
})
export class EmailModule {}
