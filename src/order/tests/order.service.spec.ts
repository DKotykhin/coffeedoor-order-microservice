import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '../order.service';
import { OrderItemService } from '../../order-item/order-item.service';
import { NotificationService } from '../../notification/notification.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: 'OrderRepository',
          useValue: {},
        },
        {
          provide: OrderItemService,
          useValue: {},
        },
        {
          provide: NotificationService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
