import { Routes } from '@angular/router';

import { authGuard } from '@presentation/guards';
import { HomePage } from '@presentation/pages';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'about', loadComponent: () => import('./presentation/pages').then((c) => c.AboutPage) },
  { path: 'login', loadComponent: () => import('./presentation/pages').then((c) => c.LoginPage) },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'manage-games',
        loadComponent: () => import('./presentation/pages').then((c) => c.GamesManagementPage),
      },
      {
        path: 'add-featured-game',
        data: {
          isFeatured: true,
        },
        loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
      },
      {
        path: 'add-game',
        loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
      },
      {
        path: 'edit-featured-game',
        data: {
          editMode: true,
          isFeatured: true,
        },
        loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
      },
      {
        path: 'archive-featured-game',
        data: {
          editMode: true,
          archiveMode: true,
        },
        loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
      },
      {
        path: 'edit-game',
        data: {
          editMode: true,
        },
        loadComponent: () => import('./presentation/pages').then((c) => c.ManageGamePage),
      },
    ],
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
