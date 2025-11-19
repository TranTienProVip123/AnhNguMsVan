import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandlers.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDb();
app.use('/api/auth', authRoutes);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API ready on ${port}`));
