import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import jwt from 'jsonwebtoken';

import mongoose from 'mongoose';
import { app } from '../app';

let mongod: any;

jest.mock('./../nats-wrapper');

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
  jest.clearAllMocks();
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
  var signin: () => [string];
}

// need to make tests self independent and not depend on other services
global.signin = () => {
  // Build a JWT Payload {id, email}
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = { id, email: 'test@test.com' };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object {jwt: MY_JWT}
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // take that JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string that the cookie with the encoded data
  return [`express:sess=${base64}`];
};
