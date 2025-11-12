import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AlsModule } from 'src/core/als/als.module';
import { UserRegisteredListener } from './listeners/user-registered.listener';

@Module({
  imports: [AlsModule],
  providers: [UserService, UserRegisteredListener],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
