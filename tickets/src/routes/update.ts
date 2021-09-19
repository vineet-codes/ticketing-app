import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@vstix/common';

import { Ticket } from '../models/ticket';

import { natsWrapper } from './../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure ticket belongs to the user who is trying to edit it
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // this might fail, maybe try catch ?, generic error handler will catch this anyway
    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();

    // publish ticket updated event to notify interested services
    // this might fail, we will not handle this faliure scenario in this project
    // To Future self: write code handle this scenario
    // options: to wait or not: if we await publishing event falls in critical path to user response of the api call
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
