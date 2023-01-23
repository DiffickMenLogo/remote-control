import { draw } from './src/draw/draw';
import { httpServer } from './src/http_server/index';
import { MessageEvent } from 'ws';
import { env } from 'process';
import * as WebSocket from 'ws';
import { mouseDown, mouseLeft, mouseRight, mouseUp, mousePosition } from './src/mc/mc';

const HTTP_PORT = env.HTTP_PORT || 8181;
const WS_PORT = env.WS_PORT || 8080;

httpServer.listen(HTTP_PORT, function () {
    console.log(`HTTP server listening on port ${HTTP_PORT}`);
});

const ws = new WebSocket.Server({ port: +WS_PORT });

ws.on('connection', function connection(ws) {
    ws.on('message', function incoming(message: MessageEvent) {
        console.log('received: %s_________', message);
        const command = message.toString().split(' ')[0];
        const amount = message.toString().split(' ')[1];
        switch (command) {
            case 'mouse_up':
                mouseUp(+amount);
                ws.send('mouse_up');
                break;
            case 'mouse_down':
                mouseDown(+amount);
                ws.send('mouse_down');
                break;
            case 'mouse_left':
                mouseLeft(+amount);
                ws.send('mouse_left');
                break;
            case 'mouse_right':
                mouseRight(+amount);
                ws.send('mouse_right');
                break;
            case 'mouse_position':
                mousePosition().then((position) => {
                    ws.send(`mouse_position {${position.x.toString()}px},{${position.y.toString()}px}`);
                });
                break;
            case 'draw_rectangle':
                const width = message.toString().split(' ')[1];
                const height = message.toString().split(' ')[2];
                mousePosition().then((position) => {
                    draw('draw_rectangle', position.x, position.y, +width, +height);
                });
                break;
            case 'draw_circle':
                const radius = message.toString().split(' ')[1];
                mousePosition().then((position) => {
                    draw('draw_circle', position.x, position.y, +radius, 0);
                });
                break;
            case 'draw_square':
                const side = message.toString().split(' ')[1];
                mousePosition().then((position) => {
                    draw('draw_square', position.x, position.y, +side, 0);
                });
                break;
            default:
                ws.send('Unknown command');
                break;
        }
    });
});

ws.on('error', function (err) {
    console.log(err);
});

process.on('SIGINT', () => {
    ws.close();
    ws.clients.forEach((client) => {
        client.close();
    });
    httpServer.close();
    httpServer.closeAllConnections();
    console.log('\nClose http and websocket servers!');
    process.exit();
});
