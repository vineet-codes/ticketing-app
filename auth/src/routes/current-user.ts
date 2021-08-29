import express from 'express';

import { currentUser } from '../middlewares/current-user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  // 1. Does this user have a `req.session.jwt` set ?
  // 2. If it is not set, or if the JWT is invalid, return early
  // 3. If yes, and JWT is valid, send back the info stored inside the JWT (the payload)

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
