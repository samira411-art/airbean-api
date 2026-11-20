import express from 'express';
import menuRoutes from './routes/menu.routes.js';
import aboutRoutes from './routes/about.routes.js';
import cartRoutes from './routes/cart.routes.js';
import userRoutes from './routes/users.routes.js';
import orderRoutes from './routes/orders.routes.js';
import { badJson, notFound, serverError } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(badJson);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Välkommen till Airbean API' });
});

app.use('/api/menu', menuRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(serverError);

export default app;
