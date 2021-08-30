import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import mongoose from 'mongoose';
import { app } from '../app';

let mongod: any;

// before running tests
beforeAll(async () => {
  // set the environment variable
  process.env.JWT_KEY = 'asdf';
  mongod = await MongoMemoryServer.create();
  const mongoUri = await mongod.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

// before runing each test
// lets make sure we delete all collections in the testdb
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// after the tests have finished, stop and close db connections
afterAll(async () => {
  await mongod.stop();
  await mongoose.connection.close();
});

declare global {
  var signin: () => Promise<string[]>;
}

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const res = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = res.get('Set-Cookie');

  return cookie;
};
