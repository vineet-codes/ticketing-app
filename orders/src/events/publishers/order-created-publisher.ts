import { Publisher, Subjects, OrderCreatedEvent } from '@vstix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
