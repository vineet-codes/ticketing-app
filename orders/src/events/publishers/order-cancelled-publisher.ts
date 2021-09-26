import { Publisher, Subjects, OrderCancelledEvent } from '@vstix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
