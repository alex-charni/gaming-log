import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { App } from './app/app';
import { appConfig } from './app/app.config';

async function enableMocks(): Promise<void> {
  if (environment.useDataMocks) {
    const { finishedGamesWorker, featuredGamesWorker } = await import('./mocks/browser');

    await finishedGamesWorker.start({
      onUnhandledRequest: 'bypass',
    });

    await featuredGamesWorker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

enableMocks().then(() => {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
});
