import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError } from '@vstix/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  // need to validate that we get id param in req
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError();

  return res.status(200).send(ticket);
});

export { router as showTicketRouter };
