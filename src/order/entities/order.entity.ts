import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../database/base.entity';
import { DeliveryWay, OrderStatus } from '../../database/db.enums';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order extends BaseEntity {
  @Column({ nullable: true })
  userName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: DeliveryWay, default: DeliveryWay.PICKUP })
  deliveryWay: DeliveryWay;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW })
  orderStatus: OrderStatus;

  @Column({ nullable: true })
  comment: string;

  @Column({ default: 0 })
  totalSum: number;

  @Column({ default: 0 })
  averageSum: number;

  @Column({ default: 0 })
  totalQuantity: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];
}
