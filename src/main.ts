import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

const port = process.env['PORT'] || 3000;
const kafkaUrl = process.env['KAFKA_URL'] || 'localhost:9092';

async function bootstrap() {
  if (process.env['CONSUMER_GROUP'] !== 'receiver') {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice({
      transport: Transport.KAFKA,
      options: {
        // This is the url used by nestjs to access a kafka broker. In my case I referenced the service created by kube that connects to the kafka broker pods
        client: {
          brokers: [kafkaUrl],
        },
      },
    });
    await app.startAllMicroservicesAsync();
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } else {
    const app = await NestFactory.createMicroservice(AppModule, {
      transport: Transport.KAFKA,
      options: {
        // This is the url used by nestjs to access a kafka broker. In my case I referenced the service created by kube that connects to the kafka broker pods
        client: {
          brokers: [kafkaUrl],
        },
      },
    });
    await app.listen(() => {
      console.log('Microservice is listening');
    });
  }
}
bootstrap();
