import { InjectionToken, NgModule } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MapViewComponent } from './ui/map-view/map-view.component';
import { environment } from '../environments/environment';
import { SearchComponent } from './ui/map-view/components/search/search.component';
import { UiModule } from './ui/ui.modue';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { HeaderComponent } from './ui/header/header.component';
import { MainSectionComponent } from './ui/main-section/main-section/main-section.component';
import { provideHttpClient } from '@angular/common/http';

export const MAP_API_KEY = new InjectionToken('MAP_API_KEY');
export const DA_DATA_API_KEY = new InjectionToken('DA_DATA_API_KEY');

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    UiModule,
    HeaderComponent,
    MainSectionComponent,
  ],
  bootstrap: [
    App,
  ],
  declarations: [
    App,
  ],
  providers: [
    provideHttpClient(),

    {
      provide: MAP_API_KEY,
      useValue: environment.yandexMapsKey,
    },
    {
      provide: DA_DATA_API_KEY,
      useValue: environment.daDataKey,
    },
  ],
  exports: [
    RouterModule,
  ]
})
export class AppModule {

}
