import express from 'express';
import 'express-async-errors';

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

// catch all route thrown NotFound Error for our errorHandle
app.all('*', async () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Listening on port 3000!!!!!`);
});
