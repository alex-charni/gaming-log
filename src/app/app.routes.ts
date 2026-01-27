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
      message: 'error.page_not_found',
      showButton: true,
    },
    loadComponent: () => import('./presentation/pages').then((m) => m.ErrorPage),
  },
];
