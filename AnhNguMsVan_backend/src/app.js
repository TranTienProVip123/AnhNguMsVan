import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import topicsRoutes from './routes/topicsRoutes.js';
import errorHandler from './middleware/errorHandlers.js';
import { config } from './config/config.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDb();
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/topics', topicsRoutes);
app.use(errorHandler);

const PORT = config.port || 4000;
app.listen(PORT, () => console.log(`API ready on ${PORT}`));
