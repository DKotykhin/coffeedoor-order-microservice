import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { CreateOrderRequest, StatusResponse } from '../order/order.pb';
import { ErrorImplementation } from '../utils/error-implementation';

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  protected readonly logger = new Logger(NotificationService.name);

  async sendToTelegram(
    createOrderRequest: CreateOrderRequest,
  ): Promise<StatusResponse> {
    const { userOrder, orderItems } = createOrderRequest;
    const { userName, phoneNumber, deliveryWay, comment } = userOrder;
    const TOKEN = this.configService.get('TELEGRAM_TOKEN');
    const CHAT_ID = this.configService.get('TELEGRAM_CHAT_ID');

    const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    let message = `<b>--- Заявка з сайту ---</b>\n`;
    message += `<b>Відправник: </b>${userName}\n`;
    message += `<b>Телефон: </b>${phoneNumber}\n`;
    message += `<b>Спосіб доставки: </b>${deliveryWay}\n`;
    message += `<b>Коментар: </b>${comment ? comment : ''}\n`;
    message += `<b>Замовлення: </b>\n`;

    let totalQuantity = 0;
    let totalSum = 0;

    orderItems.forEach((item) => {
      message += `${item.categoryTitle} ${item.itemTitle}, ${item.weight ? `${item.weight}г,` : ''} ${
        item.quantity
      } x ${item.price} грн\n`;
      totalQuantity += item.quantity;
      totalSum += +item.price * item.quantity;
    });
    message += `<b>Загалом позицій: </b>${totalQuantity}\n`;
    message += `<b>Всього на суму: </b>${totalSum} грн`;

    await firstValueFrom(
      this.httpService
        .post(URL, {
          chat_id: CHAT_ID,
          parse_mode: 'html',
          text: message,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error?.message);
            throw ErrorImplementation.badRequest(
              "Couldn't send message to telegram",
            );
          }),
        ),
    );

    return {
      status: true,
      message: 'Message sent to telegram',
    };
  }
}
