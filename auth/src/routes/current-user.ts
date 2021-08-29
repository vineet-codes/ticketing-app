import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  // 1. Does this user have a `req.session.jwt` set ?
  // 2. If it is not set, or if the JWT is invalid, return early
  // 3. If yes, and JWT is valid, send back the info stored inside the JWT (the payload)

  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
