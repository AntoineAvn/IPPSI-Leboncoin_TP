import { Request, Response, Express } from "express";
import { Server } from "socket.io";


export default class MessageController {

    static async onConnection(req: Request, io: Server) {
        console.log("test")
        io.on('connection', (socket) => {
            socket.on('Chat message', (msg: string) =>{
                console.log(`[Client] : ${msg}`)
                io.emit('Chat message', msg)
            })
        })
    }
}