import express from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';

// routes
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { IndexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

// error-handlers and middlewares
import { errorHandler, NotFoundError, currentUser } from '@vstix/common';

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

app.use(currentUser);

// user routers
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(IndexTicketRouter);
app.use(updateTicketRouter);

// catch all route thrown NotFound Error for our errorHandler
// this works because we use express-async-errors
app.all('*', async () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

export { app };
