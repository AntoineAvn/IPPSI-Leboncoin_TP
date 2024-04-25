import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from "./routes/auth"
import userRouter from "./routes/user"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

const uri = process.env.MONGODB_URI || '';
mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(express.json());

app.use('/api',
  authRouter,
  userRouter
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});