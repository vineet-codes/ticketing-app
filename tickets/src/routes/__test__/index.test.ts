import request from 'supertest';

import { app } from '../../app';

const createTicket = () => {
  const title = 'Concert';
  const price = 20;
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title,
    price,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send();

  expect(response.body.length).toEqual(3);
});
