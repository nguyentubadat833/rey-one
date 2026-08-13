// import { RequireAuth, RequireTenant } from '@/utils/decorators/auth.decorator';
// import { ApiDomainHeader } from '@/utils/decorators/utils.decorator';
// import { Controller, Get, Query, Res } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { CreatePaymentQueryDto } from '../dtos/payment-dto';
// import { SepayGatewayStrategy, SepayQRCodeStrategy } from '../services/payment/provider-strategies/payment-strategy';
// import { PaymentStrategyRegistry } from '../services/payment/provider-strategies/payment-strategy.registry';
// import { InvalidOrderStatus, OrderAlreadyPaid } from '@/utils/errors/order.error';
// import { PaymentAlreadyProcessing, PaymentAlreadySucceeded } from '@/utils/errors/payment.error';
// import type { FastifyReply } from 'fastify';

// @RequireAuth()
// @RequireTenant()
// @ApiDomainHeader()
// @ApiTags('Commerce / Payments')
// @Controller('payments')
// export class PaymentController {
//   constructor(private readonly providerStrategy: PaymentStrategyRegistry) {}

//   @Get()
//   async createPayment(@Query() queries: CreatePaymentQueryDto, @Res() reply: FastifyReply) {
//     const orderId = queries.orderId;
//     const method = queries.method;

//     const paymentStrategy = this.providerStrategy.resolve(method);
//     try {
//       const result = await paymentStrategy.initPayment({
//         method,
//         orderId,
//       });

//       if (result instanceof SepayGatewayStrategy) {
//         return reply.view('gateway-payment.hbs', {
//           checkoutUrl: result.checkoutUrl,
//           fields: result.fields,
//         });
//       } else if (result instanceof SepayQRCodeStrategy) {
//         return reply.view('qrcode-payment.hbs', {
//           ...result,
//         });
//       }
//     } catch (e) {
//       throw e;
//       //   let title: string;
//       //   let message: string;
//       //   let icon: string;
//       //   let iconColor: string;
//       //   let iconBackground: string;

//       //   if (e instanceof OrderAlreadyPaid) {
//       //     title = 'Đơn hàng đã hoàn tất';
//       //     message = 'Đơn hàng này đã được thanh toán trước đó.';
//       //     icon = '✓';
//       //     iconColor = '#16a34a';
//       //     iconBackground = '#dcfce7';
//       //   } else if (e instanceof InvalidOrderStatus) {
//       //     title = 'Không thể thanh toán';
//       //     message = 'Trạng thái đơn hàng không hợp lệ.';
//       //     icon = '!';
//       //     iconColor = '#d97706';
//       //     iconBackground = '#fef3c7';
//       //   } else if (e instanceof PaymentAlreadySucceeded) {
//       //     title = 'Thanh toán thành công';
//       //     message = 'Khoản thanh toán này đã được xử lý.';
//       //     icon = '✓';
//       //     iconColor = '#16a34a';
//       //     iconBackground = '#dcfce7';
//       //   } else if (e instanceof PaymentAlreadyProcessing) {
//       //     title = 'Đang xử lý thanh toán';
//       //     message = 'Một giao dịch đang được xử lý, vui lòng chờ.';
//       //     icon = 'i';
//       //     iconColor = '#2563eb';
//       //     iconBackground = '#dbeafe';
//       //   } else {
//       //     throw e;
//       //   }

//       //   return reply.view('order-notification.hbs', {
//       //     title,
//       //     message,
//       //     icon,
//       //     iconColor,
//       //     iconBackground,
//       //   });
//     }
//   }
// }
