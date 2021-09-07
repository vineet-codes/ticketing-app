import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns a 404 is provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'dsfsg', price: 30 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'dsfsg', price: 30 })
    .expect(401);
});

it('returns a 401 if the user does not owns a ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ewfgsg',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'fdgdfghbdf', price: 40 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ewfgsg',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 40 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'gfsgsgg', price: -40 })
    .expect(400);
});

it('updates the ticket provides an valid title and price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ewfgsg',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new Title', price: 40 })
    .expect(200);

  const ticketResponse = await request(app).get(
    `/api/tickets/${response.body.id}`
  );

  expect(ticketResponse.body.title).toEqual('new Title');
  expect(ticketResponse.body.price).toEqual(40);
});
