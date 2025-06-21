import express, { Request, Response, NextFunction } from 'express';
import { getYieldData, getOrders, createOrder } from './routes/orders.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/yield-data', getYieldData);
app.get('/api/orders', getOrders);
app.post('/api/orders', createOrder);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})