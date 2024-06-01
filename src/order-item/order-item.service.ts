import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entities/order-item.entity';
import { ErrorImplementation } from '../utils/error-implementation';
import {
  CreateOrderItemRequest,
  OrderItemList,
  StatusResponse,
  UpdateOrderItemRequest,
} from './order-item.pb';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}
  protected readonly logger = new Logger(OrderItemService.name);

  async getOrderItemById(id: string): Promise<OrderItem> {
    try {
      const orderItem = await this.orderItemRepository.findOne({
        where: { id },
        relations: ['order'],
      });
      if (!orderItem) {
        throw ErrorImplementation.notFound('Order item not found');
      }
      return orderItem;
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItemList> {
    try {
      const orderItemList = await this.orderItemRepository.find({
        where: { order: { id: orderId } },
      });
      return { orderItemList };
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.notFound("Couldn't find order items");
    }
  }

  async createOrderItem(orderItem: CreateOrderItemRequest): Promise<OrderItem> {
    try {
      return await this.orderItemRepository.save(orderItem);
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.forbidden("Couldn't create order item");
    }
  }

  async updateOrderItem(orderItem: UpdateOrderItemRequest): Promise<OrderItem> {
    try {
      const orderItemToUpdate = await this.orderItemRepository.findOne({
        where: { id: orderItem.id },
      });
      if (!orderItemToUpdate) {
        throw ErrorImplementation.notFound('Order item not found');
      }
      Object.assign(orderItemToUpdate, orderItem);
      return await this.orderItemRepository.save(orderItemToUpdate);
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async deleteOrderItem(id: string): Promise<StatusResponse> {
    try {
      const result = await this.orderItemRepository.delete(id);
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('Order item not found');
      }
      return {
        status: true,
        message: `Order item ${id} successfully deleted`,
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
