import { Routes } from '@angular/router';
import { App } from './app';
import { MapViewComponent } from './ui/map-view/map-view.component';

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
