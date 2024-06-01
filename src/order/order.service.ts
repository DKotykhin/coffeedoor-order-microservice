import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeliveryWay } from '../database/db.enums';
import { ErrorImplementation } from '../utils/error-implementation';
import { OrderItemService } from '../order-item/order-item.service';
import { NotificationService } from '../notification/notification.service';

import { Order } from './entities/order.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import {
  CreateOrderRequest,
  OrderList,
  Order as OrderType,
  OrderWithItems,
  StatusResponse,
  UpdateOrderRequest,
} from './order.pb';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private orderItemService: OrderItemService,
    private notificationService: NotificationService,
  ) {}
  protected readonly logger = new Logger(OrderService.name);

  async findOrderById(id: string): Promise<OrderWithItems> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItem'],
      });
      if (!order) {
        throw ErrorImplementation.notFound('Order not found');
      }
      return order;
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async findOrdersByUserId(userId: string): Promise<OrderList> {
    try {
      const orderList = await this.orderRepository.find({
        where: { userId },
        relations: ['orderItem'],
      });
      return { orderList };
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.notFound("Couldn't find order");
    }
  }

  async createOrder(
    createOrderRequest: CreateOrderRequest,
  ): Promise<OrderType> {
    const { orderItems, userOrder } = createOrderRequest;
    try {
      const totalQuantity = orderItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      const totalSum = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      const averageSum = Math.round(totalSum / totalQuantity);
      const order = await this.orderRepository.save({
        ...userOrder,
        averageSum,
        totalSum,
        totalQuantity,
        deliveryWay: userOrder.deliveryWay as DeliveryWay,
      });

      await Promise.all(
        orderItems.map(async (orderItem: OrderItem) => {
          orderItem.order = order;
          await this.orderItemService.createOrderItem(orderItem);
        }),
      );

      await this.notificationService.sendToTelegram(createOrderRequest);

      return order;
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.forbidden("Couldn't create order");
    }
  }

  async updateOrder(order: UpdateOrderRequest): Promise<OrderType> {
    try {
      const orderToUpdate = await this.orderRepository.findOne({
        where: { id: order.id },
      });
      if (!orderToUpdate) {
        throw ErrorImplementation.notFound('Order not found');
      }
      Object.assign(orderToUpdate, order);
      return this.orderRepository.save(orderToUpdate);
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async deleteOrder(id: string): Promise<StatusResponse> {
    try {
      const result = await this.orderRepository.delete(id);
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('Order not found');
      }
      return {
        status: true,
        message: `Order ${id} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }
}
