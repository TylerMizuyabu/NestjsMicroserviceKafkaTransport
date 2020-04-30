import { Controller, Get, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { KafkaMessage } from '@nestjs/microservices/external/kafka-options.interface';

@Controller()
export class AppController {
  constructor(@Inject('Kafka_Client') private readonly client: ClientKafka) {}

  @Get()
  sendHello(): Observable<string> {
    return this.client.send<string>('topic1', 'hello');
  }

  @MessagePattern('topic1')
  sendWorld(@Payload() data: KafkaMessage): string {
    return `${data.value} world!`;
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('topic1');
    await this.client.connect();
  }
}
