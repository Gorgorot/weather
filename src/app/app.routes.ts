import { Routes } from '@angular/router';
import { MapPageComponent } from './pages/map-page-component/map-page.component';
import { ObjectsPageComponent } from './pages/objects-page/objects-page.component';
import { HourlyPageComponent } from './pages/hourly-page/hourly-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    component: MapPageComponent,
  },
  {
    path: 'objects',
    component: ObjectsPageComponent,
  },
  {
    path: 'hourly',
    component: HourlyPageComponent,
  },
];
