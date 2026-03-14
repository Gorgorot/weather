import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { UiModule } from './ui/ui.modue';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { HeaderComponent } from './ui/header/header.component';
import { MainSectionComponent } from './ui/main-section/main-section/main-section.component';
import { provideHttpClient } from '@angular/common/http';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './db.config';

export const MAP_API_KEY = new InjectionToken('MAP_API_KEY');
export const DA_DATA_API_KEY = new InjectionToken('DA_DATA_API_KEY');

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    UiModule,
    HeaderComponent,
    MainSectionComponent,
    NgxIndexedDBModule.forRoot(dbConfig),
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
