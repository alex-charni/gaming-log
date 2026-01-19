import { Routes } from '@angular/router';
import { HomePage } from './presentation/pages';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  {
    path: 'error',
    loadComponent: () => import('./presentation/pages').then((m) => m.ErrorPage),
  },
  {
    path: '**',
    data: {
      code: 404,
      message: "The requested page can't be found.",
      showButton: true,
    },
    loadComponent: () => import('./presentation/pages').then((m) => m.ErrorPage),
  },
];
