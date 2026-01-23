import { setupWorker } from 'msw/browser';
import { featuredGamesHandler, finishedGamesHandler } from './handlers/games.handler';

export const finishedGamesWorker = setupWorker(finishedGamesHandler);
export const featuredGamesWorker = setupWorker(featuredGamesHandler);
