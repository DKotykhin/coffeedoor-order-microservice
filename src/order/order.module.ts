import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { OrderItemService } from '../order-item/order-item.service';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { NotificationService } from '../notification/notification.service';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), HttpModule],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService, NotificationService],
})
export class OrderModule {}
