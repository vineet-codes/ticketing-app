import express from 'express';
import 'express-async-errors';

import mongoose from 'mongoose';

// routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

// error-handlers
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.use(express.json());

// user routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

// catch all route thrown NotFound Error for our errorHandler
// this works because we use express-async-errors
app.all('*', async () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(`mongodb://auth-mongo-srv:27017/auth`, {
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
