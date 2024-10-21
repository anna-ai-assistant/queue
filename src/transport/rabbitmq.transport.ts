import { Connection, ConnectionOptions, Consumer, Publisher } from 'rabbitmq-client';
import { Transport } from './transport.interface';

export class RabbitmqTransport implements Transport {
  private readonly rabbit: Connection;
  private sub: Consumer;
  private pub: Publisher;

  constructor(options: ConnectionOptions, queue: string) {
    this.rabbit = new Connection(options);
    this.sub = this.createConsumer(this.rabbit, queue);
    this.pub = this.createPublisher(this.rabbit, queue);
  }

  async publish(queue: string, message: object) {
    await this.pub
      .send(
        {
          exchange: queue,
        },
        message
      );
  }

  async subscribe(queue: string, callback: any) {
    await this.sub
    .on("ready", callback);
  }

  private createConsumer(rabbit: Connection, queue: string): Consumer {
    return rabbit.createConsumer(
      {
        queue: queue,
        queueOptions: {
          durable: true,
        },
        qos: {
          prefetchCount: 2,
        },
      }, async (message: any) => {
        console.log('Received new message from queue ' + queue);
      }
    );
  }

  private createPublisher(rabbit: Connection, queue: string) {
    return rabbit.createPublisher(
      {
        confirm: true,
        maxAttempts: 5,
        exchanges: [
          {
            exchange: queue,
            type: 'topic'
          }
        ],
      }
    );
  }

  async onShutdown() {
    // Waits for pending confirmations and closes the underlying Channel
    await this.pub.close()
    // Stop consuming. Wait for any pending message handlers to settle.
    await this.sub.close()
    await this.rabbit.close()
  }
}