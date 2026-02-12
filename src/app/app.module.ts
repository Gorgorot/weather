import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MapViewComponent } from './pages/map-view/map-view.component';
import { environment } from '../environments/environment';

export const MAP_API_KEY = new InjectionToken('MAP_API_KEY');

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    MapViewComponent,
  ],
  providers: [
    {
      provide: MAP_API_KEY,
      useValue: environment.yandexMapsKey,

    },
  ],
  exports: [
    MapViewComponent,
    RouterModule,
  ]
})
export class AppModule {

}
