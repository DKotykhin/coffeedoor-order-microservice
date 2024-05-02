import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { OrderItemService } from './order-item.service';
import {
  CreateOrderItemRequest,
  ORDER_ITEM_SERVICE_NAME,
  OrderItem,
  OrderItemList,
  OrderItemServiceControllerMethods,
  StatusResponse,
} from './order-item.pb';

@OrderItemServiceControllerMethods()
@Controller()
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}
  protected readonly logger = new Logger(OrderItemController.name);

  @GrpcMethod(ORDER_ITEM_SERVICE_NAME, 'GetOrderItemById')
  getOrderItemById({ id }: { id: string }): Promise<OrderItem> {
    this.logger.log('Received GetOrderItem request');
    return this.orderItemService.getOrderItemById(id);
  }

  @GrpcMethod(ORDER_ITEM_SERVICE_NAME, 'GetOrderItemsByOrderId')
  getOrderItemsByOrderId({ id }: { id: string }): Promise<OrderItemList> {
    this.logger.log('Received GetOrderItemsByOrderId request');
    return this.orderItemService.getOrderItemsByOrderId(id);
  }

  @GrpcMethod(ORDER_ITEM_SERVICE_NAME, 'CreateOrderItem')
  createOrderItem(orderItem: CreateOrderItemRequest): Promise<OrderItem> {
    this.logger.log('Received CreateOrderItem request');
    return this.orderItemService.createOrderItem(orderItem);
  }

  @GrpcMethod(ORDER_ITEM_SERVICE_NAME, 'UpdateOrderItem')
  updateOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    this.logger.log('Received UpdateOrderItem request');
    return this.orderItemService.updateOrderItem(orderItem);
  }

  @GrpcMethod(ORDER_ITEM_SERVICE_NAME, 'DeleteOrderItem')
  deleteOrderItem({ id }: { id: string }): Promise<StatusResponse> {
    this.logger.log('Received DeleteOrderItem request');
    return this.orderItemService.deleteOrderItem(id);
  }
}
