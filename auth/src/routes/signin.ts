import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Password } from '../services/password';

import jwt from 'jsonwebtoken';

// models
import { User } from './../models/user';

// validate request middleware
import { validateRequest, BadRequestError } from '@vstix/common';
// errors

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Sign-in Logic
    // 1. Does a user with this email exists ? If not, respond with error
    // 2. Compare the password of the stored user and the supplied password
    // 3. If passwords are ther same, we are good
    // 4. User is now considered to be logged in. Send then a JWT cookie
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // generate the jwt token for the user
    // we put ! in front when we are confident that a property is defined and we have guarded against it in index.ts
    const userJWT = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );

    // set the jwt in a cookie
    req.session = { jwt: userJWT };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
