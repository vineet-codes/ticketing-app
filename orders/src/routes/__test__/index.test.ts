import request from 'supertest';

import { app } from '../../app';

import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  // create three tickets
  const ticket_1 = await buildTicket();
  const ticket_2 = await buildTicket();
  const ticket_3 = await buildTicket();

  const user_1 = global.signin();
  const user_2 = global.signin();
  // create one order as User 1

  await request(app)
    .post('/api/orders')
    .set('Cookie', user_1)
    .send({ ticketId: ticket_1.id })
    .expect(201);
  // create two orders as User 2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', user_2)
    .send({ ticketId: ticket_2.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', user_2)
    .send({ ticketId: ticket_3.id })
    .expect(201);

  // make request to fetch Orders for User 2

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', user_2)
    .expect(200);

  // make sure we only got orders for the user 2
  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);

  expect(res.body[0].ticket.id).toEqual(ticket_2.id);
  expect(res.body[1].ticket.id).toEqual(ticket_3.id);
});
