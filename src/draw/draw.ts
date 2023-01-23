import { down, right, mouse, up, left } from '@nut-tree/nut-js';

const rectangle = async (x: number, y: number) => {
    await mouse.pressButton(0);
    mouse.config.mouseSpeed = 500;
    await mouse.move(right(x));
    await mouse.move(down(y));
    await mouse.move(left(x));
    await mouse.move(up(y));
    await mouse.releaseButton(0);
};

const circle = async (mouseX: number, mouseY: number, radius: number) => {
    mouse.config.mouseSpeed = 100;
    const step = 0.01 * Math.PI;
    const fullTurn = Math.PI * 2;
    const centerX = mouseX + radius;

    mouse.config.mouseSpeed = 100;
    await mouse.pressButton(0);
    for (let angle = 0; angle <= fullTurn; angle += step) {
        await mouse.move([
            {
                x: centerX - Math.round(radius * Math.cos(angle)),
                y: mouseY - Math.round(radius * Math.sin(angle)),
            },
        ]);
    }
    await mouse.releaseButton(0);
};

export const draw = async (command: string, positionX: number, positionY: number, width: number, height: number) => {
    const mouseSpeed = mouse.config.mouseSpeed;
    switch (command) {
        case 'draw_rectangle':
            await rectangle(width, height);
            break;
        case 'draw_circle':
            await circle(positionX, positionY, width);
            break;
        case 'draw_square':
            await rectangle(width, width);
            break;
        default:
            break;
    }
    mouse.config.mouseSpeed = mouseSpeed;
};
