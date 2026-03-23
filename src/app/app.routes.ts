import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map.routes').then(m => m.MAP_ROUTES),
  },
  {
    path: 'objects',
    loadChildren: () => import('./features/objects/objects.routes').then(m => m.OBJECTS_ROUTES),
  },
  {
    path: 'hourly',
    loadChildren: () => import('./features/hourly/hourly.routes').then(m => m.HOURLY_ROUTES),
  },
];
