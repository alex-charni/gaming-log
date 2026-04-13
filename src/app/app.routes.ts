import { Routes } from '@angular/router';

import { authGuard } from '@presentation/guards';
import { HomePage } from '@presentation/pages';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'about', loadComponent: () => import('./presentation/pages').then((c) => c.AboutPage) },
  { path: 'login', loadComponent: () => import('./presentation/pages').then((c) => c.LoginPage) },
  {
    path: 'manage-games',
    canActivate: [authGuard],
    loadComponent: () => import('./presentation/pages').then((c) => c.GamesManagementPage),
  },
  {
    path: 'add-featured-game',
    canActivate: [authGuard],
    data: {
      isFeatured: true,
    },
    loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
  },
  {
    path: 'add-game',
    canActivate: [authGuard],
    loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
  },
  {
    path: 'edit-featured-game',
    canActivate: [authGuard],
    data: {
      editMode: true,
      isFeatured: true,
    },
    loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
  },
  {
    path: 'edit-game',
    canActivate: [authGuard],
    data: {
      editMode: true,
    },
    loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
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
