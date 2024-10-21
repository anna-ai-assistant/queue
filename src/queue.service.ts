import { ModuleOption } from './options/moduleOption';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from './queue';

@Injectable()
export class QueueService {
  private instances: { [key: string]: Queue } = {};
  constructor(@Inject('QUEUE_OPTIONS') private readonly moduleOption: ModuleOption) {}

  getQueue(queue: string): Queue {
    if (!this.instances[queue]) {
      const queueOption = this.moduleOption.queues.find((q) => q.name === queue);
      if (!queueOption) {
        throw new Error('Queue not found');
      }
      const transportOption = this.moduleOption.transports.find((t) => t.name === queueOption.transport);
      if (!transportOption) {
        throw new Error('Transport not found');
      }
      this.instances[queue] = new Queue(queueOption, transportOption);
    }
    return this.instances[queue];
  }
}