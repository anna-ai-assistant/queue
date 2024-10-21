import { ConnectionOptions } from 'rabbitmq-client';


export interface TransportOption extends ConnectionOptions {
  name: string;
  type: string;
}