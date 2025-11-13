import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('send-email')
  @Public()
  scheduleSendEmail(@Body() body: { time: string }) {
    this.tasksService.scheduleSendEmail(body.time);
  }

  @Get('schedule')
  @Public()
  getCurrentSchedule() {
    const time = this.tasksService.getCurrentSchedule();
    return { message: `⏰ Email send every ${time} seconds` };
  }

  @Get('all-cron-jobs')
  @Public()
  getAllCronJobs() {
    this.tasksService.getAllCronJobs();
  }
}
