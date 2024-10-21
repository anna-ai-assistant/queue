import { Transport } from './transport/transport.interface';
import { QueueOption } from './options/queue.option';
import { RabbitmqTransport } from './transport/rabbitmq.transport';
import { ConnectionOptions } from 'rabbitmq-client';

export class Queue {
  private readonly queue: string;
  private readonly transport: Transport;

  constructor(options: QueueOption, transportOptions: ConnectionOptions) {
    this.queue = options.name;
    this.transport = this.initTransport(
      options.name,
      options.transport,
      transportOptions
    );
  }

  async publish(message: object) {
    await this.transport.publish(this.queue, message);
  }

  async subscribe(callback: any) {
    await this.transport.subscribe(this.queue, callback);
  }

  private initTransport(queue: string, transport: string, transportOptions: any): Transport {
    switch (transport) {
      case 'rabbitmq':
        return new RabbitmqTransport(transportOptions, queue);
      default:
        throw new Error('Invalid transport');
    }
  }
}