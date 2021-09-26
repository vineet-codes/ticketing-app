import request from 'supertest';

import mongoose from 'mongoose';

import { app } from '../../app';

import { Order } from './../../models/order';
import { Ticket } from './../../models/ticket';

it('fetches the order', async () => {
  // create a ticket
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();
  // make a request to build an order with this ticket
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns ann error if one user tries to fetch other user orders', async () => {
  // create a ticket
  const ticket = Ticket.build({ title: 'concert', price: 20 });
  await ticket.save();
  // make a request to build an order with this ticket
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
