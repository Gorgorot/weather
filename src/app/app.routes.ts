import { Routes } from '@angular/router';
import { MapPageComponent } from './pages/map-page-component/map-page.component';
import { ObjectsPageComponent } from './pages/objects-page/objects-page.component';
import { QuickObjectInfoComponent } from './ui/quick-object-info/quick-object-info.component';

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
    children: [
      {
        path: ':id',
        component: QuickObjectInfoComponent,
      },
    ]
  }
];
