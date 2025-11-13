import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class TasksService {
  private jobName = 'daily-mail-job';
  private currentTime = '0';

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private emailService: EmailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // handleCron1() {
  //   this.logger.debug('Called every 5 seconds');
  //   this.logger.info('Sending promotions to customers...');
  // }

  // @Cron('45 * * * * *')
  // handleCron2() {
  //   this.logger.debug('Called when the second is 45');
  // }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }

  // addCronJob(name: string, seconds: string) {
  //   const job = new CronJob(`${seconds} * * * * *`, () => {
  //     this.logger.warn(`time (${seconds}) for job ${name} to run!`);
  //   });

  //   this.schedulerRegistry.addCronJob(name, job);
  //   job.start();

  //   this.logger.warn(
  //     `job ${name} added for each minute at ${seconds} seconds!`,
  //   );
  // }

  private deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
  }

  private addCron(name: string, time: string) {
    this.currentTime = time;
    const cronTime = `*/${time} * * * * *`;

    const job = new CronJob(cronTime, () => {
      this.emailService.sendEmail('Test daily send email');
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added for ${time}`);
  }

  scheduleSendEmail(time: string) {
    try {
      this.deleteCron(this.jobName);
    } catch (_) {
      this.logger.warn(`job ${this.jobName} not found!`);
    }

    this.addCron(this.jobName, time);
  }

  getCurrentSchedule() {
    return this.currentTime;
  }

  getAllCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDate().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.info(`job: ${key} -> next: ${next}`);
    });
  }
}
