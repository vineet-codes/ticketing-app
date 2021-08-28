import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { User } from './../models/user';

// custom sub-classes for error handling
import { RequestValidationError } from '../errors/request-validation-error';
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
  async (req: Request, res: Response) => {
    //
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    // User Signup flow
    // 1. Does a user with this email already exists ? If so, respond with error : CutomError type of BadRequestError
    // 2. Can't store passwords in plain text, Hash the password user entered : this is done via Pre save hook of mongoose
    // 3. Create a new User and save them to MongoDB
    // 4. User is now considered logged in, Send them a cookie/jwt etc

    const { email, password } = req.body;

    // find and check if a user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // create a new user and save to db
    const user = User.build({ email, password });
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };
