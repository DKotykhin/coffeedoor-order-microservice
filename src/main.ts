import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { HEALTH_CHECK_PACKAGE_NAME } from './health-check/health-check.pb';
import { ORDER_PACKAGE_NAME } from './order/order.pb';
import { ORDER_ITEM_PACKAGE_NAME } from './order-item/order-item.pb';

const logger = new Logger('main.ts');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const PORT = configService.get<string>('TRANSPORT_PORT');
  const HOST = configService.get<string>('TRANSPORT_HOST');
  const URL = `${HOST}:${PORT}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [
          HEALTH_CHECK_PACKAGE_NAME,
          ORDER_ITEM_PACKAGE_NAME,
          ORDER_PACKAGE_NAME,
        ],
        protoPath: [
          join(__dirname, '../proto/health-check.proto'),
          join(__dirname, '../proto/order.proto'),
          join(__dirname, '../proto/order-item.proto'),
        ],
        url: URL,
      },
    },
  );
  await app.listen();
  logger.log('Order microservice is running on ' + URL);
}
bootstrap();
