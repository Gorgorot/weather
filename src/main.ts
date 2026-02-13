import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';

platformBrowser().bootstrapModule(AppModule);

/*bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));*/
