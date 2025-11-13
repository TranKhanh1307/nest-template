import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
