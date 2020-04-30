import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject('Kafka_Client') private readonly client: ClientKafka) {}

  @Get()
  sendHello(): Observable<string> {
    return this.client.send<string>('topic1', 'hello');
  }

  @MessagePattern('topic1')
  sendWorld(): string {
    return 'world';
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('topic1');
    await this.client.connect();
  }
}
