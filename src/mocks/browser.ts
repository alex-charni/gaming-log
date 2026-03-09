import { setupWorker } from 'msw/browser';
import { featuredGamesHandler, finishedGamesHandler } from './handlers/games.handler';

export const gamesWorker = setupWorker(finishedGamesHandler, featuredGamesHandler);
