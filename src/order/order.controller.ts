import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { OrderService } from './order.service';
import {
  CreateOrderRequest,
  ORDER_SERVICE_NAME,
  Order,
  OrderList,
  OrderServiceControllerMethods,
  StatusResponse,
  UpdateOrderRequest,
} from './order.pb';

@OrderServiceControllerMethods()
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  protected readonly logger = new Logger(OrderController.name);

  @GrpcMethod(ORDER_SERVICE_NAME, 'GetOrderById')
  getOrderById({ id }: { id: string }): Promise<Order> {
    this.logger.log('Received GetOrderById request');
    return this.orderService.findOrderById(id);
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'GetOrdersByUserId')
  getOrdersByUserId({ id }: { id: string }): Promise<OrderList> {
    this.logger.log('Received GetOrdersByUserId request');
    return this.orderService.findOrdersByUserId(id);
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'CreateOrder')
  createOrder(createOrderRequest: CreateOrderRequest): Promise<Order> {
    this.logger.log('Received CreateOrder request');
    return this.orderService.createOrder(createOrderRequest);
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'UpdateOrder')
  updateOrder(order: UpdateOrderRequest): Promise<Order> {
    this.logger.log('Received UpdateOrder request');
    return this.orderService.updateOrder(order);
  }

  @GrpcMethod(ORDER_SERVICE_NAME, 'DeleteOrder')
  deleteOrder({ id }: { id: string }): Promise<StatusResponse> {
    this.logger.log('Received DeleteOrder request');
    return this.orderService.deleteOrder(id);
  }
}
