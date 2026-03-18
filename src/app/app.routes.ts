import { Routes } from '@angular/router';

import { authGuard } from '@presentation/guards';
import { HomePage } from '@presentation/pages';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'about', loadComponent: () => import('./presentation/pages').then((c) => c.AboutPage) },
  { path: 'login', loadComponent: () => import('./presentation/pages').then((c) => c.LoginPage) },
  {
    path: 'add-game',
    canActivate: [authGuard],
    loadComponent: () => import('./presentation/pages').then((c) => c.AddGamePage),
  },
  {
    path: 'error',
    loadComponent: () => import('./presentation/pages').then((c) => c.ErrorPage),
  },
  {
    path: '**',
    data: {
      code: 404,
      message: 'error.page_not_found',
      showButton: true,
    },
    loadComponent: () => import('./presentation/pages').then((c) => c.ErrorPage),
  },
];
