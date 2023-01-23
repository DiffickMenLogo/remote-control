import { mouse, left, right, up, down } from '@nut-tree/nut-js';

export const mouseDown = async (amount: number) => {
    await mouse.move(down(amount));
};

export const mouseUp = async (amount: number) => {
    await mouse.move(up(amount));
};

export const mouseLeft = async (amount: number) => {
    await mouse.move(left(amount));
};

export const mouseRight = async (amount: number) => {
    await mouse.move(right(amount));
};

export const mousePosition = async () => {
    return await mouse.getPosition();
};
