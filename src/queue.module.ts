import { DynamicModule, Module } from '@nestjs/common';
import { ModuleOption } from './options/moduleOption';
import { QueueOption } from './options/queue.option';
import { QueueService } from './queue.service';

@Module({})
export class QueueModule {
  static options?: ModuleOption
  static forRoot(options: ModuleOption): DynamicModule {
    this.options = options;
    return this.loadModule(this.options, [])
  }

  static forFeature(queues: QueueOption[]): DynamicModule
  {
    if (this.options === null)
    {
      throw new Error('options seem to be undefined');
    }
    return this.loadModule(this.options, queues)
  }

  private static loadModule(options: ModuleOption, queues: QueueOption[])
  {
    options.queues = [...options.queues, ...queues];
    return {
      module: QueueModule,
      imports: [],
      providers: [
        {
          provide: 'QUEUE_OPTIONS',
          useValue: options,
        },
        QueueService
      ],
      exports: [QueueService],
    };
  }
}
