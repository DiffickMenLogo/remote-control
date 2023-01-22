import { httpServer } from './src/http_server/index';
import { MessageEvent } from 'ws';
import { env } from 'process';
import * as WebSocket from 'ws';
import { mouseDown, mouseLeft, mouseRight, mouseUp, mousePosition } from './src/mc/mc';

const HTTP_PORT = env.HTTP_PORT || 8181;
const ws = new WebSocket.Server({ server: httpServer });

ws.on('connection', function connection(ws) {
    ws.on('message', function incoming(message: MessageEvent) {
        console.log('received: %s_________', message);
        if (message.toString().startsWith('mouse')) {
            const direction = message.toString().split('_')[1].split(' ')[0];
            const amount = message.toString().split(' ')[1];
            switch (direction) {
                case 'up':
                    mouseUp(+amount);
                    ws.send('mouse_up');
                    break;
                case 'down':
                    mouseDown(+amount);
                    ws.send('mouse_down');
                    break;
                case 'left':
                    mouseLeft(+amount);
                    ws.send('mouse_left');
                    break;
                case 'right':
                    mouseRight(+amount);
                    ws.send('mouse_right');
                    break;
                case 'position':
                    mousePosition().then((position) => {
                        ws.send(`mouse_position {${position.x.toString()}px},{${position.y.toString()}px}`);
                    });
                    break;
            }
        }
    });
});

ws.on('error', function (err) {
    console.log(err);
});

httpServer.listen(HTTP_PORT, function () {
    console.log(`HTTP server listening on port ${HTTP_PORT}`);
});
