import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});