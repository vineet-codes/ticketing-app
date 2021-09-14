import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

// function to start the appliocation
// 1. check if all environment variables are available
// 2. Try to connect to the mongodb/data store
// 3/ Start listening on port and serving request
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Environment variable JWT_KEY not defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('Environment variable JWT_KEY not defined');
  }

  try {
    await natsWrapper.connect('ticketing', 'abc', 'http://nats-srv:4222');

    // gracefull shutdown for NATS
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log(`Listening on port 3000!!!!!`);
  });
};

start();
