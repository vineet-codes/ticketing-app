import express from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';

// routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

// error-handlers
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

// requests are being proxied through ingress-nginx,
// telling express to trust
app.set('trust proxy', true);

// body parser
app.use(express.json());

// cookie setting library
// TODO: We probably want to encrypt the cookies
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

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

export { app };
