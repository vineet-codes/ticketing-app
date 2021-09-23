import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@vstix/common';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  res.send('orders');
});

export { router as indexOrderRouter };
