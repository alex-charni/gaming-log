import { setupWorker } from 'msw/browser';
import { gamesHandler } from './handlers/games.handler';

export const worker = setupWorker(gamesHandler);
