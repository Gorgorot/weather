import { Routes } from '@angular/router';
import { App } from './app';
import { MapViewComponent } from './pages/map-view/map-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    component: MapViewComponent,
  }
];
