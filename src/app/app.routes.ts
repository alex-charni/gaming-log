import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
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
