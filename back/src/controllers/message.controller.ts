import { WebSocket } from 'ws';


export default class MessageController {

    static async handleWebSocket(ws: WebSocket) {
        ws.on('message', (message: string) => {
            console.log('Received message:', message);
            ws.send('Echo: ' + message);
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    }
    
}