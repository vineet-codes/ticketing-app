import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/orders', async (req: Request, res: Response) => {
  res.status(201).send('order created');
});

export { router as createOrderRouter };
