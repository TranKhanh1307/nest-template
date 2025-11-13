import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron1() {
    this.logger.debug('Called every 5 seconds');
    this.logger.info('Sending promotions to customers...');
  }

  @Cron('45 * * * * *')
  handleCron2() {
    this.logger.debug('Called when the second is 45');
  }

  @Interval(10000)
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job ${name} added for each minute at ${seconds} seconds!`,
    );
  }
}
