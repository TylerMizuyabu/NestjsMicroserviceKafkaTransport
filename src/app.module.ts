import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

const consumerGroup = process.env['CONSUMER_GROUP'];
const kafkaUrl = process.env['KAFKA_URL'] || 'localhost:9092';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Kafka_Client', //The injection string token for the client
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [kafkaUrl],
          },
          consumer: {
            groupId: consumerGroup, //The client group you want this kafka consumer instance to fall under
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
