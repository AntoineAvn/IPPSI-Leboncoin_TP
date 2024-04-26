import express, { Express, Request, Response } from 'express'
import http from "http"
import WebSocket from 'ws'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import announceRouter from "./routes/annonce"
import catergoriesRouter from "./routes/categories"
import MessageController from './controllers/message.controller'


dotenv.config()

const app: Express = express()
const server = http.createServer(app);
const wss = new WebSocket.Server({ server })
const port = process.env.PORT || 3001

const uri = process.env.MONGODB_URI || ''
mongoose.connect(uri)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

app.use(cors())
app.use(express.json())

app.use('/api',
  authRouter,
  userRouter,
  announceRouter,
  catergoriesRouter
)


wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket connected');
  MessageController.handleWebSocket(ws)
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world')
})

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})