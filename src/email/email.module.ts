import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserRegisteredListener } from './listeners/user-registered.listener';

@Module({
  providers: [EmailService, UserRegisteredListener],
  exports: [EmailService],
})
export class EmailModule {}
