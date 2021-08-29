import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';

import { User } from './../models/user';

import { validateRequest } from '../middlewares/validate-request';

// custom sub-classes for error handling
import { BadRequestError } from '../errors/bad-request';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // User Signup flow
    // 1. Does a user with this email already exists ? If so, respond with error : CutomError type of BadRequestError
    // 2. Can't store passwords in plain text, Hash the password user entered : this is done via Pre save hook of mongoose
    // 3. Create a new User and save them to MongoDB
    // 4. User is now considered logged in, Send them a cookie/jwt etc

    const { email, password } = req.body;

    //1. find and check if a user with email already exists
    // TODO this lookup isn't constant time, so it can leak information
    // (ex: when the email doesn't exist). When using a DB like Postgres,
    // index the `email` field so that your query is timing-safe.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    // 2,3. create a new user and save to db, pwd hasing happens in a pre-save hook
    const user = User.build({ email, password });
    await user.save();

    // generate the jwt token for the user
    // we put ! in front when we are confident that a property is defined and we have guarded against it in index.ts
    const userJWT = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    // set the jwt in a cookie
    req.session = { jwt: userJWT };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
