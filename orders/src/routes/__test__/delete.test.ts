import request from 'supertest';

import { app } from '../../app';

import { Order, OrderStatus } from './../../models/order';
import { Ticket } from './../../models/ticket';

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();

  const user = global.signin();
  // make a request to cancel the order

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // expectation to make sure the thing is cancelled

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an order cancelled event');
