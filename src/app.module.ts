import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './utils/env.validator';
import { HealthCheckModule } from './health-check/health-check.module';
import { DatabaseModule } from './database/database.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    HealthCheckModule,
    DatabaseModule,
    OrderModule,
    NotificationModule,
    OrderItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
