import { QueueOption } from './queue.option';
import { TransportOption } from './transport.option';

export interface ModuleOption {
  queues?: QueueOption[];
  transports: TransportOption[];
}