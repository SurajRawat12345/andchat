import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();
const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});